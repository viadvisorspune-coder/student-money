/* Margin documentation helpers. Not part of the system. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in (attrs || {})) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'font-size') n.style.fontSize = attrs[k] + 'px';
      else if (k === 'color') n.style.color = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  /* Scale fixed-size (mm) figures down to the column they sit in. */
  function fit() {
    document.querySelectorAll('.fit').forEach(function (w) {
      var inner = w.firstElementChild;
      inner.style.transform = 'none';
      var s = Math.min(1, w.offsetWidth / inner.offsetWidth);
      inner.style.transform = 'scale(' + s + ')';
      w.style.height = (inner.offsetHeight * s) + 'px';
    });
  }
  window.addEventListener('resize', fit);
  document.addEventListener('DOMContentLoaded', fit);
  if (document.fonts) document.fonts.ready.then(fit);
  window.MarginDoc = { svg: svgEl, fit: fit, NS: NS };
})();
