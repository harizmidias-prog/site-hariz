(function () {
  // Filtros do catálogo
  var root = document.querySelector('[data-filter-root]');
  if (root) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-tags]'));
    var count = document.querySelector('[data-count]');
    var apply = function (key) {
      var shown = 0;
      cards.forEach(function (card) {
        var tags = card.getAttribute('data-tags').split(' ');
        var ok = key === 'todas' || tags.indexOf(key) !== -1;
        card.hidden = !ok;
        if (ok) shown++;
      });
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === key ? 'true' : 'false');
      });
      if (count) {
        var one = count.getAttribute('data-one') || '1 coleção';
        var many = count.getAttribute('data-many') || 'coleções';
        count.textContent = shown === 1 ? one : shown + ' ' + many;
      }
      Array.prototype.slice.call(document.querySelectorAll('[data-group]')).forEach(function (g) {
        g.hidden = !(key === 'todas' || g.getAttribute('data-group') === key);
      });
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });
    var start = (location.hash || '').replace('#', '');
    var known = buttons.some(function (b) { return b.getAttribute('data-filter') === start; });
    apply(known ? start : 'todas');
  }

  // Destaque da home: sorteia uma coleção a cada visita
  var feats = Array.prototype.slice.call(document.querySelectorAll('[data-feature-item]'));
  if (feats.length > 1) {
    var pick = Math.floor(Math.random() * feats.length);
    feats.forEach(function (f, i) { f.hidden = i !== pick; });
  }

  // Abertura da home: fotos em sequência
  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-dot]'));
    var cur = 0, timer = null;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var show = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === cur); });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    };
    var play = function () {
      if (still || slides.length < 2) return;
      clearInterval(timer);
      timer = setInterval(function () { if (!document.hidden) show(cur + 1); }, 6000);
    };
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); play(); }); });
    play();
  }

  // Miniaturas de cada peça (Mobiliário de Kelim)
  Array.prototype.slice.call(document.querySelectorAll('[data-gallery]')).forEach(function (g) {
    var m = g.querySelector('[data-main]');
    var bs = Array.prototype.slice.call(g.querySelectorAll('[data-src]'));
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        m.src = b.getAttribute('data-src');
        bs.forEach(function (x) { x.setAttribute('aria-current', x === b ? 'true' : 'false'); });
      });
    });
  });

  // Galeria da página de coleção
  var main = document.querySelector('[data-main-photo]');
  if (main) {
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-full]'));
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.getAttribute('data-full');
        main.alt = t.getAttribute('data-alt') || main.alt;
        thumbs.forEach(function (x) { x.setAttribute('aria-current', x === t ? 'true' : 'false'); });
      });
    });
  }
})();
