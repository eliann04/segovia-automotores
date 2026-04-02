// =============================================================
//  catalog.js — Usados  |  Fuente de datos: Airtable
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {

    // --- Elementos DOM ---
    const catalogGrid    = document.getElementById('catalogGrid');
    const filterMake     = document.getElementById('filterMake');
    const filterYear     = document.getElementById('filterYear');
    const filterMaxPrice = document.getElementById('filterMaxPrice');
    const btnApply       = document.getElementById('btnApplyFilters');
    const btnReset       = document.getElementById('btnResetFilters');
    const noResultsMsg   = document.getElementById('noResultsMsg');

    if (!catalogGrid) return;

    // --- Sort buttons ---
    const sortBtns = document.querySelectorAll('.sort-btn');

    // --- Estado ---
    let allVehicles  = [];
    let currentSort  = 'name-asc';

    // ─── Helpers ─────────────────────────────────────────────
    const formatPrice = price =>
        new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', maximumFractionDigits: 0
        }).format(price);

    // ─── Sort ─────────────────────────────────────────────────
    function getSortedCars(cars) {
        const sorted = [...cars];
        switch (currentSort) {
            case 'name-asc':
                sorted.sort((a, b) => (a.nombre || `${a.marca} ${a.año}`).localeCompare(b.nombre || `${b.marca} ${b.año}`));
                break;
            case 'name-desc':
                sorted.sort((a, b) => (b.nombre || `${b.marca} ${b.año}`).localeCompare(a.nombre || `${a.marca} ${a.año}`));
                break;
            case 'price-desc':
                sorted.sort((a, b) => (b.precio || 0) - (a.precio || 0));
                break;
            case 'price-asc':
                sorted.sort((a, b) => (a.precio || 0) - (b.precio || 0));
                break;
            case 'year-desc':
                sorted.sort((a, b) => (b.año || 0) - (a.año || 0));
                break;
            case 'year-asc':
                sorted.sort((a, b) => (a.año || 0) - (b.año || 0));
                break;
        }
        return sorted;
    }

    // ─── Skeleton loading ────────────────────────────────────
    function showSkeleton(n = 6) {
        catalogGrid.innerHTML = '';
        catalogGrid.style.display = 'grid';
        noResultsMsg.style.display = 'none';
        for (let i = 0; i < n; i++) {
            catalogGrid.insertAdjacentHTML('beforeend', `
                <div class="car-card skeleton-card">
                    <div class="skeleton skeleton-img"></div>
                    <div class="card-info">
                        <div class="skeleton skeleton-line" style="width:70%;height:1.2rem;margin-bottom:.6rem;"></div>
                        <div class="skeleton skeleton-line" style="width:45%;height:1rem;"></div>
                    </div>
                </div>`);
        }
    }

    // ─── Error state ─────────────────────────────────────────
    function showError() {
        catalogGrid.innerHTML = '';
        catalogGrid.style.display = 'block';
        catalogGrid.innerHTML = `
            <div class="airtable-error">
                <div class="airtable-error-icon">⚠️</div>
                <h3>No se pudieron cargar los vehículos</h3>
                <p>Hubo un problema al conectar con nuestra base de datos.<br>
                   Por favor revisá tu conexión e intentá de nuevo.</p>
                <button class="btn btn-outline" onclick="location.reload()">Reintentar</button>
            </div>`;
    }

    // ─── Render cards ─────────────────────────────────────────
    function renderCars(cars) {
        catalogGrid.innerHTML = '';

        if (!cars.length) {
            catalogGrid.style.display = 'none';
            noResultsMsg.style.display = 'block';
            return;
        }

        catalogGrid.style.display = 'grid';
        noResultsMsg.style.display = 'none';

        cars.forEach(car => {
            const imgSrc     = car.imagen || 'img/catalog1.png';
            const nombre     = car.nombre || `${car.marca} ${car.año || ''}`.trim();
            const precioText = car.precio ? formatPrice(car.precio) : '';
            const kmText     = car.kilometraje || '—';
            const transText  = car.transmision || '—';

            catalogGrid.insertAdjacentHTML('beforeend', `
                <div class="car-card fade-up visible">
                    <a href="vehiculo-detalle.html?id=${car.id}" class="card-img-wrapper" style="display:block;position:relative;">
                        <img src="${imgSrc}" alt="${nombre}" loading="lazy"
                             onerror="this.src='img/catalog1.png'">
                        <div class="img-overlay">
                            <span class="view-more-content">
                                <div class="overlay-icon-circle">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                Ver más
                            </span>
                        </div>
                        ${car.marca ? `<span class="car-brand-label">${car.marca.toUpperCase()}</span>` : ''}
                    </a>
                    <div class="card-info">
                        <div class="card-header-flex">
                            <h3>${nombre}</h3>
                            ${precioText ? `<span class="price-tag">${precioText}</span>` : ''}
                        </div>
                        <div class="card-tags">
                            ${car.año ? `<span class="tag">${car.año}</span>` : ''}
                            <span class="tag">${kmText}</span>
                            <span class="tag">${transText}</span>
                        </div>
                        <a href="vehiculo-detalle.html?id=${car.id}" class="btn btn-outline btn-ver-detalles">
                            Ver detalles
                        </a>
                    </div>
                </div>`);
        });
    }

    // ─── Poblar filtros ───────────────────────────────────────
    function populateFilters(vehicles) {
        if (!filterMake || !filterYear) return;

        const makes = [...new Set(vehicles.map(v => v.marca).filter(Boolean))].sort();
        const years = [...new Set(vehicles.map(v => v.año).filter(Boolean))].sort((a, b) => b - a);

        // Limpiar opciones previas (menos la primera "Todos")
        filterMake.querySelectorAll('option:not([value="all"])').forEach(o => o.remove());
        filterYear.querySelectorAll('option:not([value="all"])').forEach(o => o.remove());

        makes.forEach(m => filterMake.insertAdjacentHTML('beforeend', `<option value="${m}">${m}</option>`));
        years.forEach(y => filterYear.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));
    }

    // ─── Aplicar filtros ──────────────────────────────────────
    function applyFilters() {
        const selectedMake = filterMake?.value  || 'all';
        const selectedYear = filterYear?.value  || 'all';
        const maxPrice     = parseFloat(filterMaxPrice?.value) || NaN;

        const filtered = allVehicles.filter(v => {
            const okMake  = selectedMake === 'all' || v.marca === selectedMake;
            const okYear  = selectedYear === 'all' || String(v.año) === selectedYear;
            const okPrice = isNaN(maxPrice) || (v.precio && v.precio <= maxPrice);
            return okMake && okYear && okPrice;
        });

        renderCars(getSortedCars(filtered));
    }

    function resetFilters() {
        if (filterMake)     filterMake.value  = 'all';
        if (filterYear)     filterYear.value  = 'all';
        if (filterMaxPrice) filterMaxPrice.value = '';
        // Reset sort
        currentSort = 'name-asc';
        sortBtns.forEach(b => b.classList.toggle('active', b.dataset.sort === 'name-asc'));
        renderCars(getSortedCars(allVehicles));
    }

    // ─── Event listeners de filtros ───────────────────────────
    btnApply?.addEventListener('click',  applyFilters);
    btnReset?.addEventListener('click',  resetFilters);

    // ─── Event listeners de ordenamiento ─────────────────────
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSort = btn.dataset.sort;
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Re-apply filters with the new sort
            applyFilters();
        });
    });

    // ─── Cargar datos desde Airtable ──────────────────────────
    showSkeleton();

    try {
        const vehicles = await fetchAirtableVehicles();
        // Solo usados
        allVehicles = vehicles.filter(v => v.tipo === 'usado');
        populateFilters(allVehicles);
        renderCars(allVehicles);
    } catch {
        showError();
    }

    // ─── Collapsible panels ──────────────────────────────
    document.getElementById('toggleFilters')?.addEventListener('click', () => {
        document.getElementById('panelFilters')?.classList.toggle('collapsed');
    });
    document.getElementById('toggleSort')?.addEventListener('click', () => {
        document.getElementById('panelSort')?.classList.toggle('collapsed');
    });

    // ─── Navbar scroll effect ─────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.style.background    = window.scrollY > 50 ? 'rgba(0,0,0,0.8)'  : 'rgba(0,0,0,0.6)';
        navbar.style.borderBottom  = window.scrollY > 50 ? '1px solid var(--border-hover)' : '1px solid var(--border-gray)';
    });

    // ─── Intersection Observer (elementos estáticos) ──────────
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up:not(.car-card)').forEach(el => observer.observe(el));
});
