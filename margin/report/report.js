/* Margin testing report: runheads, folios and drawn routes. */
(function () {
  var M = window.Margin;
  var pages = document.querySelectorAll('.pg');
  pages.forEach(function (pg, i) {
    var n = String(i + 1).padStart(2, '0');
    pg.id = pg.id || 'p' + n;
    if (pg.hasAttribute('data-bare')) return;
    var sec = pg.getAttribute('data-sec') || '';
    var rh = document.createElement('div');
    rh.className = 'rh m-runhead m-runhead--rule';
    rh.innerHTML = '<span><b>Margin</b>&nbsp;&nbsp;Testing and behavioural research report</span><span>' + sec.replace(/  /, '&nbsp;&nbsp;') + '</span>';
    pg.insertBefore(rh, pg.firstChild);
    var ft = document.createElement('div');
    ft.className = 'ft m-footer';
    ft.innerHTML = '<span style="opacity:0.6">Confidential. Participants are shown by code only.</span><span class="m-folio m-folio--node">' + n + '</span>';
    pg.appendChild(ft);
  });

  function S(id) { return document.getElementById(id); }
  function R(id, pts, o) { var s = S(id); if (s) M.route(s, pts, o || {}); }
  function N(id, x, y, k, o) { var s = S(id); if (s) M.node(s, x, y, k, o || {}); }
  window.MR = { R: R, N: N, S: S };

  // 01 cover: route through the four decisions
  R('cov-r', [[18, 112], [52, 112], [92, 140], [126, 172], [150, 206], [192, 206]], { radius: 10 });
  N('cov-r', 18, 112); N('cov-r', 192, 206, 'future');
  // 02 contents spine
  R('toc-r', [[3, 9], [3, 159]]); [9, 59, 109, 159].forEach(function (y) { N('toc-r', 3, y); });
  // 04 mechanism map: each row to the common opportunity
  for (var i = 0; i < 8; i++) { var y = 5 + i * 14; R('mmap-r', [[97, y], [112, y], [112, 50], [127, 50]], { radius: 5, hair: true }); N('mmap-r', 97, y); }
  N('mmap-r', 127, 50);
  // 05 the gap
  R('gap-r', [[22, 2], [22, 98]], { style: 'dashed' });
  // 09 architecture spine
  R('arch-r', [[3, 3], [3, 168]]); [0, 33, 66, 99, 132, 165].forEach(function (y, k) { N('arch-r', 3, y + 3, k === 5 ? 'future' : 'event'); });
  // 11 six days: dashed day rails with ghost slots
  for (var d = 0; d < 6; d++) { var x = 14.5 + d * 29; R('six-r', [[x, 9], [x, 42]], { style: 'dotted' }); N('six-r', x, 20, 'future'); N('six-r', x, 32, 'future'); }


  // 20 friction timeline
  R('fr-r', [[15, 14], [84, 14]]); R('fr-r', [[84, 14], [157, 14]], { style: 'dotted' });
  N('fr-r', 15, 14); N('fr-r', 47, 14, 'event', { size: 6 }); N('fr-r', 84, 14); N('fr-r', 121, 14, 'future'); N('fr-r', 157, 14, 'future');
  // 24 information value map
  R('ivm-r', [[8, 2], [8, 104], [172, 104]], { radius: 0, hair: true });
  [[27, 86.5], [33, 68.5], [59, 54.5], [109, 38.5], [137, 20.5]].forEach(function (p, k) { N('ivm-r', p[0], p[1], k > 2 ? 'event' : 'future', { size: 3.4 }); });
  R('ivm-r', [[27, 86.5], [59, 54.5], [137, 20.5]], { style: 'dashed', radius: 0 });
  // 25 competing forces: equal arrows
  (function () {
    var s = S('force-r'); if (!s) return;
    var names = ['Money', 'Social participation', 'Comfort', 'Time', 'Hunger', 'Value', 'Responsibility', 'Convenience'];
    var box = document.getElementById('force-labels');
    names.forEach(function (t, k) {
      var a = -Math.PI / 2 + k * Math.PI / 4, c = Math.cos(a), si = Math.sin(a);
      R('force-r', [[87 + c * 66, 60 + si * 48], [87 + c * 32, 60 + si * 32]], { radius: 0 });
      N('force-r', 87 + c * 32, 60 + si * 32);
      var sp = document.createElement('span');
      sp.className = 'tagc abs'; sp.textContent = t;
      sp.style.left = (87 + c * 72) + 'mm'; sp.style.top = (60 + si * 53) + 'mm'; sp.style.transform = 'translate(-50%,-50%)';
      if (t === 'Money') { sp.className = 'tagc tagc--blue abs'; }
      box.appendChild(sp);
    });
  })();
  // 27 mental accounting loop
  (function () {
    if (!S('loop-r')) return;
    R('loop-r', [[30, 12], [144, 12], [144, 78], [30, 78], [30, 12]], { radius: 12 });
    var host = S('loop-r').parentNode;
    [[87, 12, 0], [144, 45, 90], [87, 78, 180], [30, 45, 270]].forEach(function (p) {
      var i = document.createElement('i'); i.className = 'ar abs';
      i.style.cssText = 'left:' + (p[0] - 4) + 'mm;top:' + (p[1] - 6) + 'mm;width:8mm;height:4mm;margin:0;transform:rotate(' + p[2] + 'deg) translateY(-4mm);background-color:var(--m-paper);border-radius:2mm';
      host.appendChild(i);
    });
  })();
  if (window.PAGE_DRAW) window.PAGE_DRAW.forEach(function (f) { f(R, N, S); });
})();
