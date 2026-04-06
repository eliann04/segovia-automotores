// =============================================================
//  0km-modelos.js â€” Modelos por marca  |  Fuente: Airtable
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {

    const urlParams      = new URLSearchParams(window.location.search);
    const selectedBrand  = urlParams.get('brand');

    if (!selectedBrand) { window.location.href = ''; return; }

    const modelsGrid   = document.getElementById('models-grid');
    const noResultsMsg = document.getElementById('noResultsMsg');

    // â”€â”€â”€ TÃ­tulos iniciales â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.title = `${selectedBrand} 0km - Segovia Automotores`;
    document.getElementById('bc-brand-name').textContent = selectedBrand;
    const pageTitle = document.getElementById('page-title');
    pageTitle.textContent = selectedBrand.toUpperCase();

    // â”€â”€â”€ Logo de marca conocido â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const BRAND_LOGOS = {
        'toyota': 'img/toyota.png', 'volkswagen': 'img/volkswagen.png',
        'vw': 'img/volkswagen.png', 'fiat': 'img/fiat.png',
        'renault': 'img/renault.png', 'peugeot': 'img/logo-Peugeot.png',
        'ford': 'img/ford.png', 'chevrolet': 'img/chevrolet.png',
        'citroÃ«n': 'img/citroen.png', 'citroen': 'img/citroen.png',
        'jeep': 'img/jeep.png',
    };

    // â”€â”€â”€ Skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function showSkeleton() {
        modelsGrid.innerHTML = '';
        modelsGrid.style.display = 'grid';
        for (let i = 0; i < 3; i++) {
            modelsGrid.insertAdjacentHTML('beforeend', `
                <div class="car-card model-0km-card skeleton-card">
                    <div class="skeleton skeleton-img" style="height:220px;"></div>
                    <div class="card-info">
                        <div class="skeleton skeleton-line" style="width:65%;height:1.2rem;margin-bottom:.6rem;"></div>
                        <div class="skeleton skeleton-line" style="width:40%;height:.9rem;"></div>
                    </div>
                </div>`);
        }
    }

    // â”€â”€â”€ Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function showError() {
        modelsGrid.style.display = 'none';
        noResultsMsg.style.display = 'block';
        noResultsMsg.innerHTML = `
            <div class="airtable-error">
                <div class="airtable-error-icon">âš ï¸</div>
                <h3>No se pudieron cargar los modelos</h3>
                <p>Hubo un problema al conectar con la base de datos.</p>
                <button class="btn btn-outline" onclick="location.reload()">Reintentar</button>
            </div>
            <a href="0km" class="btn btn-outline" style="margin-top:1rem;">Volver a Marcas</a>`;
    }

    // â”€â”€â”€ Cargar desde Airtable â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    showSkeleton();

    try {
        const vehicles  = await fetchAirtableVehicles();
        const brandModels = vehicles.filter(v =>
            v.tipo === '0km' &&
            v.marca.toLowerCase() === selectedBrand.toLowerCase()
        );

        modelsGrid.innerHTML = '';

        if (!brandModels.length) {
            modelsGrid.style.display = 'none';
            noResultsMsg.style.display = 'block';
            return;
        }

        modelsGrid.style.display = 'grid';
        noResultsMsg.style.display = 'none';

        brandModels.forEach(vehicle => {
            const imgSrc    = vehicle.imagen || 'img/catalog1.png';
            const nombre    = vehicle.nombre || `${vehicle.marca} ${vehicle.aÃ±o || ''}`.trim();
            const wspMsg    = encodeURIComponent(
                `Hola! Me interesa consultar el 0km: ${nombre}${vehicle.aÃ±o ? ` (${vehicle.aÃ±o})` : ''}. Â¿PodrÃ­an darme mÃ¡s informaciÃ³n?`
            );
            const waLink    = `https://wa.me/5492235409018?text=${wspMsg}`;

            modelsGrid.insertAdjacentHTML('beforeend', `
                <div class="car-card model-0km-card fade-up visible">
                    <div class="brand-accent-line" style="background-color:#fff;width:40px;border-radius:0 0 4px 0;"></div>
                    <div class="card-img-wrapper">
                        <img src="${imgSrc}" alt="${nombre}" loading="lazy"
                             onerror="this.src='img/catalog1.png'">
                    </div>
                    <div class="card-info" style="gap:.5rem;justify-content:space-between;">
                        <div>
                            <h3 style="font-size:1.4rem;margin-bottom:.5rem;">${nombre}</h3>
                            <div class="card-tags" style="margin-bottom:1.5rem;">
                                ${vehicle.aÃ±o ? `<span class="tag">AÃ±o ${vehicle.aÃ±o}</span>` : ''}
                                ${vehicle.motor ? `<span class="tag">${vehicle.motor}</span>` : ''}
                                ${vehicle.transmision ? `<span class="tag">${vehicle.transmision}</span>` : ''}
                            </div>
                        </div>
                        <a href="${waLink}" target="_blank" class="btn btn-outline"
                           style="width:100%;text-align:center;">
                            ðŸ’¬ Consultar por WhatsApp
                        </a>
                    </div>
                </div>`);
        });

    } catch {
        showError();
    }

    // â”€â”€â”€ Navbar scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.style.background   = window.scrollY > 50 ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)';
        navbar.style.borderBottom = window.scrollY > 50 ? '1px solid var(--border-hover)' : '1px solid var(--border-gray)';
    });

    // â”€â”€â”€ Intersection Observer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up:not(.car-card)').forEach(el => observer.observe(el));
});

