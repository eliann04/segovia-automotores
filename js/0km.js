// =============================================================
//  0km.js — Vehículos 0KM  |  Fuente de datos: Airtable
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {

    const brandsGrid = document.getElementById('brands-grid');
    if (!brandsGrid) return;

    // ─── Logos conocidos de marcas (fallback) ─────────────────
    const BRAND_LOGOS = {
        'toyota':      'img/toyota.png',
        'volkswagen':  'img/volkswagen.png',
        'vw':          'img/volkswagen.png',
        'fiat':        'img/fiat.png',
        'renault':     'img/renault.png',
        'peugeot':     'img/logo-Peugeot.png',
        'ford':        'img/ford.png',
        'chevrolet':   'img/chevrolet.png',
        'citroën':     'img/citroen.png',
        'citroen':     'img/citroen.png',
        'jeep':        'img/jeep.png',
    };

    function getLogoForBrand(brandName) {
        return BRAND_LOGOS[brandName.toLowerCase()] || 'img/logo.png';
    }

    // ─── Skeleton ────────────────────────────────────────────
    function showSkeleton(n = 6) {
        brandsGrid.innerHTML = '';
        for (let i = 0; i < n; i++) {
            brandsGrid.insertAdjacentHTML('beforeend', `
                <div class="brand-card-complex skeleton-card">
                    <div class="card-complex-top skeleton skeleton-img"></div>
                    <div class="card-complex-bottom" style="padding:1.2rem">
                        <div class="skeleton skeleton-line" style="width:60%;height:1rem;margin-bottom:.5rem;"></div>
                        <div class="skeleton skeleton-line" style="width:40%;height:.8rem;"></div>
                    </div>
                </div>`);
        }
    }

    // ─── Error ───────────────────────────────────────────────
    function showError() {
        brandsGrid.innerHTML = `
            <div class="airtable-error" style="grid-column:1/-1;">
                <div class="airtable-error-icon">⚠️</div>
                <h3>No se pudieron cargar los modelos</h3>
                <p>Hubo un problema al conectar con nuestra base de datos.<br>
                   Por favor revisá tu conexión e intentá de nuevo.</p>
                <button class="btn btn-outline" onclick="location.reload()">Reintentar</button>
            </div>`;
    }

    // ─── Sin stock ───────────────────────────────────────────
    function showEmpty() {
        brandsGrid.innerHTML = `
            <div class="airtable-error" style="grid-column:1/-1;">
                <div class="airtable-error-icon" style="font-size:2.5rem;">🚗</div>
                <h3>No hay vehículos 0km disponibles</h3>
                <p>Próximamente sumaremos nuevos modelos. Escribinos para más información.</p>
            </div>`;
    }

    // ─── Render brands ───────────────────────────────────────
    function renderBrands(vehicles0km) {
        brandsGrid.innerHTML = '';

        // Agrupar por marca
        const grouped = {};
        vehicles0km.forEach(v => {
            const key = v.marca.trim();
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(v);
        });

        const brands = Object.keys(grouped).sort();

        if (!brands.length) { showEmpty(); return; }

        brands.forEach((brandName, index) => {
            const models = grouped[brandName];
            const count  = models.length;
            const label  = count === 1 ? '1 modelo' : `${count} modelos`;
            const logo   = getLogoForBrand(brandName);
            const delay  = (index * 0.08).toFixed(2);

            brandsGrid.insertAdjacentHTML('beforeend', `
                <a href="0km-modelos?brand=${encodeURIComponent(brandName)}"
                   class="brand-card-complex fade-up visible"
                   style="transition-delay:${delay}s">
                    <div class="card-complex-top">
                        <img src="${logo}" alt="Logo ${brandName}" class="card-complex-bg-logo">
                        <div class="card-complex-name-overlay">${brandName}</div>
                    </div>
                    <div class="card-complex-bottom">
                        <h3 class="card-complex-title">${brandName}</h3>
                        <p class="card-complex-models">${label}</p>
                        <div class="card-complex-btn">Ver modelos <span class="arrow">&rsaquo;</span></div>
                    </div>
                </a>`);
        });

        // Limpiar delays después de la animación inicial
        setTimeout(() => {
            document.querySelectorAll('.brand-card-complex').forEach(card => {
                card.style.transitionDelay = '0s';
                const bg = card.querySelector('.card-complex-bg-logo');
                if (bg) bg.style.transitionDelay = '0s';
            });
        }, 1500);
    }

    // ─── Cargar desde Airtable ────────────────────────────────
    showSkeleton();

    try {
        const vehicles = await fetchAirtableVehicles();
        // Solo 0km
        const vehicles0km = vehicles.filter(v => v.tipo === '0km');
        renderBrands(vehicles0km);
    } catch {
        showError();
    }

    // ─── Navbar scroll ────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.style.background   = window.scrollY > 50 ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)';
        navbar.style.borderBottom = window.scrollY > 50 ? '1px solid var(--border-hover)' : '1px solid var(--border-gray)';
    });

    // ─── Intersection Observer ────────────────────────────────
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up:not(.brand-card-complex)').forEach(el => observer.observe(el));
});
