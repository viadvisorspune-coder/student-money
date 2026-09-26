/* Margin — route helper.
   Draws the travelling line from orthogonal waypoints, with every turn rounded,
   and places node symbols on it. Classic script (works from file://); exposes window.Margin.

   Coordinates are millimetres: give the SVG a viewBox in mm (an A4 page is 0 0 210 297).

   Margin.route(svg, points, { style: 'solid' | 'dashed' | 'dotted', radius: 8, at: 0 })
   Margin.node(svg, x, y, kind, { at: 0 })   kind: event | future | planned | unexpected | turning
   Margin.animate(svg)                        draws the route on first view (screen only) */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var TOKENS = { radius: 8, node: 4.4 };

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function unit(a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l, l];
  }

  /* Path data for a polyline with rounded corners. The radius is clamped to half of
     the shorter adjoining segment so short hops never overshoot. */
  function pathData(points, radius) {
    var r0 = radius == null ? TOKENS.radius : radius;
    var d = 'M' + points[0][0] + ' ' + points[0][1];
    for (var i = 1; i < points.length - 1; i++) {
      var a = points[i - 1], p = points[i], b = points[i + 1];
      var u = unit(a, p), v = unit(p, b);
      var r = Math.min(r0, u[2] / 2, v[2] / 2);
      var cross = u[0] * v[1] - u[1] * v[0];
      var s = [p[0] - u[0] * r, p[1] - u[1] * r];
      var e = [p[0] + v[0] * r, p[1] + v[1] * r];
      d += ' L' + s[0] + ' ' + s[1];
      if (Math.abs(cross) < 1e-6) continue;           // straight through
      d += ' A' + r + ' ' + r + ' 0 0 ' + (cross > 0 ? 1 : 0) + ' ' + e[0] + ' ' + e[1];
    }
    var last = points[points.length - 1];
    return d + ' L' + last[0] + ' ' + last[1];
  }

  function route(svg, points, opts) {
    opts = opts || {};
    var style = opts.style || 'solid';
    var cls = 'm-route' + (style === 'solid' ? '' : ' m-route--' + style) + (opts.hair ? ' m-route--hair' : '');
    var path = el('path', { d: pathData(points, opts.radius), class: cls });
    if (opts.at) path.style.setProperty('--at', opts.at + 'ms');
    svg.appendChild(path);
    path.style.setProperty('--len', Math.ceil(path.getTotalLength ? path.getTotalLength() : 1000));
    return path;
  }

  /* Node symbols. Sizes derive from the node token (4.4mm) so every shape reads
     at the same visual weight as the round terminal. */
  function node(svg, x, y, kind, opts) {
    opts = opts || {};
    var s = (opts.size || TOKENS.node) / 2;
    var n;
    switch (kind || 'event') {
      case 'future':
        n = el('circle', { cx: x, cy: y, r: s - 0.6, class: 'm-node m-node--future' });
        break;
      case 'planned':
        var q = s * 0.9;
        n = el('rect', { x: x - q, y: y - q, width: q * 2, height: q * 2, class: 'm-node' });
        break;
      case 'unexpected':
        var k = s * 1.25;
        n = el('path', { d: 'M' + x + ' ' + (y - k) + ' L' + (x + k) + ' ' + y + ' L' + x + ' ' + (y + k) + ' L' + (x - k) + ' ' + y + 'Z', class: 'm-node' });
        break;
      case 'turning':
        var o = s * 1.7, i = s * 0.45, d = '';
        for (var j = 0; j < 8; j++) {
          var ang = Math.PI / 4 * j - Math.PI / 2, rr = j % 2 ? i : o;
          d += (j ? 'L' : 'M') + (x + Math.cos(ang) * rr).toFixed(2) + ' ' + (y + Math.sin(ang) * rr).toFixed(2);
        }
        n = el('path', { d: d + 'Z', class: 'm-node' });
        break;
      default:
        n = el('circle', { cx: x, cy: y, r: s, class: 'm-node' });
    }
    if (opts.at) n.style.setProperty('--at', opts.at + 'ms');
    svg.appendChild(n);
    return n;
  }

  /* Adds .m-animate, then .is-drawn once the SVG is in view. Honours reduced motion via CSS. */
  function animate(target) {
    target.classList.add('m-animate');
    if (!('IntersectionObserver' in window)) { target.classList.add('is-drawn'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { requestAnimationFrame(function () { target.classList.add('is-drawn'); }); io.disconnect(); }
      });
    }, { threshold: 0.25 });
    io.observe(target);
  }

  function replay(target) {
    target.classList.remove('is-drawn');
    void target.getBoundingClientRect();
    requestAnimationFrame(function () { requestAnimationFrame(function () { target.classList.add('is-drawn'); }); });
  }

  window.Margin = { route: route, node: node, pathData: pathData, animate: animate, replay: replay, tokens: TOKENS };
})();
