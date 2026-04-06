// =============================================================
//  home.js — Página de Inicio  |  Fuente: Airtable
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {

    // ─── Logos conocidos de marcas ────────────────────────────
    const BRAND_LOGOS = {
        'toyota':     'img/toyota2.png',
        'volkswagen': 'img/volkswagen2.png',
        'vw':         'img/volkswagen2.png',
        'fiat':       'img/fiat2.png',
        'renault':    'img/renault2.png',
        'peugeot':    'img/peugeot2.png',
        'ford':       'img/ford2.png',
        'chevrolet':  'img/chevrolet2.png',
        'citroën':    'img/citroen2.png',
        'citroen':    'img/citroen2.png',
        'jeep':       'img/jeep2.png',
    };

    // ─── Carrusel de usados destacados ────────────────────────
    const carouselContainer = document.getElementById('home-vehicles-carousel');

    // ─── Grilla de marcas 0km ─────────────────────────────────
    const brandsGridContainer = document.getElementById('home-brands-grid');

    // Si no hay Airtable disponible, salir
    if (typeof fetchAirtableVehicles === 'undefined') return;

    try {
        const vehicles = await fetchAirtableVehicles();

        // ── Carrusel: vehículos usados ─────────────────────────
        if (carouselContainer) {
            // Mostrar solo usados marcados con "Inicio" — si no hay ninguno, mostrar todos los usados
        const destacados = vehicles.filter(v => v.inicio && v.tipo === 'usado');
        const usados     = destacados.length
            ? destacados
            : vehicles.filter(v => v.tipo === 'usado');

            if (usados.length) {
                const buildCard = (car) => {
                    const img    = car.imagen || 'img/catalog1.png';
                    const nombre = car.nombre || `${car.marca} ${car.año || ''}`.trim();
                    const marca  = car.marca  || '';
                    const km     = car.kilometraje || '';
                    return `
                        <a href="vehiculo-detalle?id=${car.id}" class="home-car-card">
                            <div class="home-car-img-wrapper">
                                <img src="${img}" alt="${nombre}" loading="lazy"
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
                            </div>
                            <div class="home-car-info">
                                <h3>${nombre}</h3>
                                <p class="home-car-subtext">${marca ? marca : ''}${marca && car.año ? ' &nbsp;|&nbsp; ' : ''}${car.año ? car.año : ''}</p>
                                ${km ? `<p class="home-car-details">USADO &bull; ${km.toUpperCase()}</p>` : ''}
                                <span class="home-car-link">Ver más &rarr;</span>
                            </div>
                        </a>`;
                };

                // ── Con menos de 4 autos o en MÓVIL: estático, sin duplicar ──
                const isMobile = 'ontouchstart' in window;
                if (usados.length < 4 || isMobile) {
                    usados.forEach(car => carouselContainer.insertAdjacentHTML('beforeend', buildCard(car)));
                    // Sin auto-scroll en mobile ni cuando hay pocos autos
                } else {
                    // ── Desktop con 4 o más: carrusel infinito con copias ─────────
                    const COPIES = Math.max(8, Math.ceil(20 / usados.length));
                    for (let i = 0; i < COPIES; i++) {
                        usados.forEach(car => carouselContainer.insertAdjacentHTML('beforeend', buildCard(car)));
                    }

                    let setWidth  = 0;
                    let scrollPos = 0;
                    let isHovered = false;

                    carouselContainer.addEventListener('mouseenter', () => isHovered = true);
                    carouselContainer.addEventListener('mouseleave', () => isHovered = false);

                    function autoScroll() {
                        if (!setWidth && carouselContainer.scrollWidth > 0) {
                            setWidth = carouselContainer.scrollWidth / COPIES;
                        }
                        if (!isHovered && setWidth) {
                            scrollPos += 0.9;
                            if (scrollPos >= setWidth) scrollPos -= setWidth;
                            carouselContainer.scrollLeft = scrollPos;
                        }
                        requestAnimationFrame(autoScroll);
                    }
                    requestAnimationFrame(autoScroll);
                }
            }
        }

        // ── Grilla 0km: marcas únicas con stock ───────────────
        if (brandsGridContainer) {
            const vehicles0km = vehicles.filter(v => v.tipo === '0km');

            // Obtener marcas únicas con al menos 1 modelo 0km publicado
            const marcas = [...new Set(vehicles0km.map(v => v.marca.trim()))].sort();

            if (marcas.length) {
                brandsGridContainer.innerHTML = '';

                marcas.forEach((brandName, index) => {
                    const logo  = BRAND_LOGOS[brandName.toLowerCase()] || 'img/logo.png';
                    const delay = (index * 0.08).toFixed(2);

                    brandsGridContainer.insertAdjacentHTML('beforeend', `
                        <a href="0km-modelos?brand=${encodeURIComponent(brandName)}"
                           class="home-brand-card fade-up visible"
                           style="transition-delay:${delay}s">
                            <div class="home-brand-logo">
                                <img src="${logo}" alt="Logo ${brandName}">
                            </div>
                            <span>${brandName}</span>
                        </a>`);
                });

                // Limpiar delays tras animación inicial
                setTimeout(() => {
                    document.querySelectorAll('.home-brand-card').forEach(c => {
                        c.style.transitionDelay = '0s';
                    });
                }, 1500);
            }
        }

    } catch (err) {
        console.error('[home.js] Error cargando datos de Airtable:', err);
    }

    // ─── FAQ Accordion ────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const current = question.parentElement;
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== current) item.classList.remove('active');
            });
            current.classList.toggle('active');
        });
    });
});
