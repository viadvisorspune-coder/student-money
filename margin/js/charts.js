/* Margin, chart primitives. Classic script; exposes window.MarginCharts.
   Charts are SVG with a viewBox in millimetres, so every size is a print size.
   Text inside charts uses the system type classes; font sizes are given in mm
   (2.3mm about 6.5pt, 2.8mm about 8pt, 4.6mm about 13pt).

   Rules this file enforces (see rules.html, Data integrity):
   - one axis per chart, a zero baseline for anything measured by length;
   - marks are blue, the one mark the chart is about is route red, the insight band is mustard;
   - text never takes a series colour except the route-red annotation;
   - every mark carries a <title> for hover, and every chart gets a data table. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var C = {
    blue: 'var(--m-blue)', red: 'var(--m-route)', mustard: 'var(--m-mustard)', ink: 'var(--m-ink)',
    paper: 'var(--m-paper)', deep: 'var(--m-paper-deep)', stone: 'var(--m-stone)',
    ramp: ['var(--m-blue-1)', 'var(--m-blue-2)', 'var(--m-blue-3)', 'var(--m-blue-4)', 'var(--m-blue-5)']
  };
  var SIZE = { label: 2.72, tick: 2.72, value: 3.53, note: 2.72, big: 7.41 };
  /* Text sizes snap to the five sizes of the type scale (7.7, 10, 10.5, 17.5, 21pt). Sizes are in mm (user units). */
  var SCALE_PT = [7.7, 10, 10.5, 17.5, 21];
  function snapMM(mm) {
    var pt = mm * 72 / 25.4, best = SCALE_PT[0];
    SCALE_PT.forEach(function (s) { if (Math.abs(s - pt) < Math.abs(best - pt)) best = s; });
    return +(best * 25.4 / 72).toFixed(3);
  }


  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in (attrs || {})) {
      var v = attrs[k];
      if (v == null) continue;
      if (k === 'text') n.textContent = v;
      else if (k === 'title') { var t = document.createElementNS(NS, 'title'); t.textContent = v; n.appendChild(t); }
      else if (k === 'size') n.style.fontSize = snapMM(+v) + 'px';
      else if (k === 'color') n.style.color = v;
      else n.setAttribute(k, v);
    }
    if (parent) parent.appendChild(n);
    return n;
  }

  function svg(container, w, h, label) {
    var s = el('svg', { viewBox: '0 0 ' + w + ' ' + h, role: 'img', 'aria-label': label, class: 'm-chart' });
    s.style.width = w + 'mm'; s.style.height = h + 'mm'; s.style.display = 'block'; s.style.overflow = 'visible';
    container.appendChild(s);
    return s;
  }

  function lin(d0, d1, r0, r1) {
    var f = function (v) { return r0 + (v - d0) / (d1 - d0) * (r1 - r0); };
    f.domain = [d0, d1]; f.range = [r0, r1];
    return f;
  }
  function band(keys, r0, r1, pad) {
    var step = (r1 - r0) / keys.length, p = pad == null ? 0.3 : pad;
    var f = function (k) { return r0 + keys.indexOf(k) * step + step * p / 2; };
    f.bw = step * (1 - p); f.step = step; f.center = function (k) { return f(k) + f.bw / 2; };
    return f;
  }

  function text(s, x, y, str, cls, o) {
    o = o || {};
    return el('text', { x: x, y: y, class: cls || 'm-label', size: o.size || SIZE.label, 'text-anchor': o.anchor, 'dominant-baseline': o.baseline, color: o.color, transform: o.transform, text: str }, s);
  }

  /* Axis: a hairline in ink with small blue ticks. Recessive by design. */
  function axisX(s, x, y, ticks, fmt, o) {
    o = o || {};
    el('line', { x1: o.from != null ? o.from : x.range[0], x2: o.to != null ? o.to : x.range[1], y1: y, y2: y, stroke: C.ink, 'stroke-width': 0.25 }, s);
    ticks.forEach(function (t) {
      el('line', { x1: x(t), x2: x(t), y1: y, y2: y + 1, stroke: C.ink, 'stroke-width': 0.25 }, s);
      text(s, x(t), y + 4, fmt ? fmt(t) : t, 'm-label m-label--blue', { anchor: 'middle', size: SIZE.tick });
    });
    if (o.title) text(s, o.titleX != null ? o.titleX : x.range[1], y + 8.6, o.title, 'm-label', { anchor: o.titleX != null ? 'start' : 'end', size: SIZE.tick });
  }
  function axisY(s, y, x, ticks, fmt, o) {
    o = o || {};
    if (o.line !== false) el('line', { x1: x, x2: x, y1: y.range[0], y2: y.range[1], stroke: C.ink, 'stroke-width': 0.25 }, s);
    ticks.forEach(function (t) {
      if (o.grid) el('line', { x1: x, x2: o.grid, y1: y(t), y2: y(t), stroke: C.deep, 'stroke-width': 0.3 }, s);
      text(s, x - 1.6, y(t), fmt ? fmt(t) : t, 'm-label m-label--blue', { anchor: 'end', baseline: 'central', size: SIZE.tick });
    });
    if (o.title) text(s, x - 1.6, y.range[1] - 4, o.title, 'm-label', { anchor: 'start', size: SIZE.tick });
  }

  /* Marks: the node grammar, in any colour. */
  function mark(s, shape, x, y, r, o) {
    o = o || {};
    var fill = o.fill || C.blue, n;
    if (shape === 'square') n = el('rect', { x: x - r * 0.9, y: y - r * 0.9, width: r * 1.8, height: r * 1.8, fill: fill }, s);
    else if (shape === 'diamond') n = el('path', { d: 'M' + x + ' ' + (y - r * 1.2) + 'L' + (x + r * 1.2) + ' ' + y + 'L' + x + ' ' + (y + r * 1.2) + 'L' + (x - r * 1.2) + ' ' + y + 'Z', fill: fill }, s);
    else if (shape === 'ring') n = el('circle', { cx: x, cy: y, r: r - 0.3, fill: C.paper, stroke: fill, 'stroke-width': 0.6 }, s);
    else if (shape === 'half') {
      n = el('g', {}, s);
      el('circle', { cx: x, cy: y, r: r - 0.3, fill: C.paper, stroke: fill, 'stroke-width': 0.6 }, n);
      el('path', { d: 'M' + x + ' ' + (y - r + 0.3) + ' A' + (r - 0.3) + ' ' + (r - 0.3) + ' 0 0 0 ' + x + ' ' + (y + r - 0.3) + 'Z', fill: fill }, n);
    }
    else n = el('circle', { cx: x, cy: y, r: r, fill: fill }, s);
    if (o.title) el('title', { text: o.title }, n);
    return n;
  }

  /* Annotation: a red hairline leader to a note in the text face. Lines split on '|'. */
  function note(s, x, y, tx, ty, str, o) {
    o = o || {};
    el('path', { d: 'M' + x + ' ' + y + ' L' + tx + ' ' + ty, stroke: C.red, 'stroke-width': 0.3, fill: 'none' }, s);
    el('circle', { cx: x, cy: y, r: 0.7, fill: C.red }, s);
    var anchor = o.anchor || 'start', dx = anchor === 'end' ? -1.2 : anchor === 'middle' ? 0 : 1.2;
    str.split('|').forEach(function (line, i) {
      text(s, tx + dx, ty + 0.9 + i * (SIZE.note * 1.4) + (o.dy || 0), line, 'm-note', { anchor: anchor, size: o.size || SIZE.note });
    });
  }

  /* A data table in a <details>, so every chart can be read without colour or shape. */
  function table(container, head, rows, caption) {
    var d = document.createElement('details'); d.className = 'm-chart-data';
    var sm = document.createElement('summary'); sm.textContent = 'Data table'; d.appendChild(sm);
    var t = document.createElement('table'); t.className = 'm-table';
    t.innerHTML = '<thead><tr>' + head.map(function (h, i) { return '<th' + (i ? ' class="num"' : '') + '>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? ' class="num"' : '') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>' +
      (caption ? '<caption>' + caption + '</caption>' : '');
    d.appendChild(t); container.appendChild(d);
    return d;
  }

  function inr(n) {
    var s = String(Math.round(Math.abs(n))), last3 = s.slice(-3), rest = s.slice(0, -3);
    if (rest) last3 = ',' + last3;
    return (n < 0 ? '−' : '') + '₹' + rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last3;
  }

  window.MarginCharts = { snapMM: snapMM, C: C, SIZE: SIZE, el: el, svg: svg, lin: lin, band: band, text: text, axisX: axisX, axisY: axisY, mark: mark, note: note, table: table, inr: inr };
})();
