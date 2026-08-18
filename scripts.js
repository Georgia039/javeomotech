// Sticky bar
  const stickyBar = document.getElementById('stickyBar');
  const buyBox = document.querySelector('.header-buy');
  const observer = new IntersectionObserver(
    ([entry]) => stickyBar.classList.toggle('visible', !entry.isIntersecting),
    { threshold: 0 }
  );
  if (buyBox) observer.observe(buyBox);

  function toggleArticle() {
    const more = document.getElementById('articleMore');
    const btn = document.getElementById('readMoreBtn');
    more.classList.toggle('open');
    btn.textContent = more.classList.contains('open') ? 'Show Less ↑' : 'Read Full Review ↓';
  }

  function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('open');
  }
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

  function handleSave(btn) {
    btn.textContent = '✓ Saved!';
    btn.style.color = '#16a34a';
    btn.style.borderColor = '#16a34a';
    setTimeout(() => {
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Save to Wishlist';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const t = document.getElementById('copyToast');
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2200);
    });
  }

  // ── SIDEBAR: You Might Also Like + Recently Added ──
  // Reads from /products.json (built from _data/products.json) instead of
  // scraping index.html — one source of truth, no HTML parsing needed.
  (async function loadSidebar() {
    const sidebarEl = document.getElementById('pageSidebar');
    if (!sidebarEl) return;
    const currentSlug = sidebarEl.getAttribute('data-current-slug');
    const currentCat = sidebarEl.getAttribute('data-current-cat');

    try {
      const res = await fetch('/products.json');
      const allProducts = (await res.json()).filter(p => p.review_slug !== currentSlug);

      function render(list, elId) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.innerHTML = list.map(p => `
          <a class="sidebar-product" href="/reviews/${p.review_slug}/">
            <img src="${p.image}" loading="lazy" alt="${p.name}" />
            <div class="sidebar-product-info">
              <div class="sidebar-product-name">${p.name}</div>
              <div class="sidebar-product-price">${p.price}</div>
            </div>
          </a>
        `).join('');
      }

      // You Might Also Like — same category, randomly pulled
      const sameCat = allProducts.filter(p => p.category === currentCat);
      const pool = sameCat.length >= 3 ? sameCat : allProducts;
      render([...pool].sort(() => Math.random() - 0.5).slice(0, 3), 'relatedProducts');

      // Recently Added — products.json is generated newest-first, so just take the top slice
      render(allProducts.slice(0, 3), 'recentProducts');
    } catch (e) {
      sidebarEl.style.display = 'none';
    }
  })();