// =============================================================
//  detalle.js — Detalle de vehículo  |  Fuente: Airtable
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const carId     = urlParams.get('id');

    if (!carId) { window.location.href = 'vehiculos.html'; return; }

    const formatPrice = price =>
        new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', maximumFractionDigits: 0
        }).format(price);

    // ─── Mostrar loading placeholder ──────────────────────────
    const mainContainer = document.querySelector('.detalle-main .container');
    document.getElementById('car-title').textContent        = 'Cargando...';
    document.getElementById('mobile-car-title').textContent = 'Cargando...';

    let car;

    try {
        const vehicles = await fetchAirtableVehicles();
        // Buscar por Airtable record ID (parámetro ?id=recXXXX)
        car = vehicles.find(v => v.id === carId);
    } catch {
        mainContainer.innerHTML = `
            <div class="airtable-error" style="margin-top:6rem;">
                <div class="airtable-error-icon">⚠️</div>
                <h3>No se pudo cargar el vehículo</h3>
                <p>Hubo un problema al conectar con nuestra base de datos.</p>
                <a href="vehiculos.html" class="btn btn-outline">Volver al catálogo</a>
            </div>`;
        return;
    }

    if (!car) {
        mainContainer.innerHTML = `
            <div class="no-results" style="text-align:center;padding:4rem 0;margin-top:4rem;">
                <h1 class="massive-title" style="font-size:3rem;">Vehículo no encontrado</h1>
                <a href="vehiculos.html" class="btn btn-solid" style="margin-top:2rem;">Volver al catálogo</a>
            </div>`;
        return;
    }

    // ─── Datos normalizados ───────────────────────────────────
    const nombre   = car.nombre   || `${car.marca} ${car.año || ''}`.trim();
    const subtitle = [car.marca, car.año].filter(Boolean).join(' · ');
    const images   = car.fotos.length ? car.fotos : ['img/catalog1.png'];

    // ─── Poblar DOM ───────────────────────────────────────────
    document.title = `${nombre} - Segovia Automotores`;
    document.getElementById('bc-bodytype').textContent = car.marca || 'Vehículo';

    document.getElementById('car-title').textContent        = nombre;
    document.getElementById('mobile-car-title').textContent = nombre;
    document.getElementById('mobile-car-title').style.display = 'block';
    document.getElementById('car-subtitle').innerHTML       = subtitle;

    document.getElementById('spec-km').textContent    = car.kilometraje  || '—';
    document.getElementById('spec-motor').textContent = car.motor        || '—';
    document.getElementById('spec-year').textContent  = car.año          || '—';
    document.getElementById('spec-trans').textContent = car.transmision  || '—';
    document.getElementById('spec-fuel').textContent  = car.combustible  || '—';
    document.getElementById('spec-doors').textContent = car.puertas      || '—';

    document.getElementById('car-description').textContent = car.descripcion || 'Sin descripción disponible.';

    // ─── Carrusel de fotos ────────────────────────────────────
    let currentIdx   = 0;
    const mainImg    = document.getElementById('main-image');
    const counter    = document.getElementById('image-counter');
    const thumbRow   = document.getElementById('thumbnail-row');

    function updateGallery() {
        mainImg.src = images[currentIdx];
        counter.textContent = `${currentIdx + 1}/${images.length}`;
        document.querySelectorAll('.thumb-wrapper').forEach((el, i) => {
            el.classList.toggle('active', i === currentIdx);
        });
    }

    images.forEach((src, i) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb-wrapper ${i === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${src}" alt="Foto ${i + 1}" loading="lazy" onerror="this.src='img/catalog1.png'">`;
        thumb.addEventListener('click', () => { 
            currentIdx = i; 
            updateGallery(); 
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        thumbRow.appendChild(thumb);
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + images.length) % images.length;
        updateGallery();
    });
    document.getElementById('next-btn').addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % images.length;
        updateGallery();
    });

    updateGallery();

    // ─── Lightbox para Zoom ───────────────────────────────────
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <button class="nav-arrow prev-arrow" id="lb-prev" style="z-index: 10001; position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);">&larr;</button>
        <img class="lightbox-content" id="lb-img" alt="Zoom Foto">
        <button class="nav-arrow next-arrow" id="lb-next" style="z-index: 10001; position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);">&rarr;</button>
        <div class="image-counter" id="lb-counter" style="z-index: 10001; bottom: 2rem; position: absolute;"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = document.getElementById('lb-img');
    const lbCounter = document.getElementById('lb-counter');
    let isZoomed = false;

    function updateLightbox() {
        lbImg.src = images[currentIdx];
        lbCounter.textContent = `${currentIdx + 1}/${images.length}`;
        isZoomed = false;
        lbImg.classList.remove('zoomed');
        lbImg.style.transformOrigin = 'center center';
    }

    mainImg.addEventListener('click', () => {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightbox();
    });

    document.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    document.getElementById('lb-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIdx = (currentIdx - 1 + images.length) % images.length;
        updateLightbox();
        updateGallery();
    });

    document.getElementById('lb-next').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIdx = (currentIdx + 1) % images.length;
        updateLightbox();
        updateGallery();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    lbImg.addEventListener('click', (e) => {
        e.stopPropagation();
        isZoomed = !isZoomed;
        if (isZoomed) {
            lbImg.classList.add('zoomed');
        } else {
            lbImg.classList.remove('zoomed');
            lbImg.style.transformOrigin = 'center center';
        }
    });

    lbImg.addEventListener('mousemove', (e) => {
        if (!isZoomed) return;
        const x = (e.offsetX / e.target.offsetWidth) * 100;
        const y = (e.offsetY / e.target.offsetHeight) * 100;
        lbImg.style.transformOrigin = `${x}% ${y}%`;
    });

    lbImg.addEventListener('mouseleave', () => {
        if (isZoomed) {
            isZoomed = false;
            lbImg.classList.remove('zoomed');
            lbImg.style.transformOrigin = 'center center';
        }
    });

    // ─── Botones de acción ────────────────────────────────────
    document.getElementById('btn-consultar').addEventListener('click', e => {
        e.preventDefault();
        const precioText = car.precio ? formatPrice(car.precio) : 'a consultar';
        const msg = encodeURIComponent(
            `Hola! Me interesa el ${nombre}${car.año ? ` (${car.año})` : ''}. Precio publicado: ${precioText}. ¿Podría darme más información?`
        );
        window.open(`https://wa.me/5492235409018?text=${msg}`, '_blank');
    });

    document.getElementById('btn-compartir').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({ title: nombre, url: window.location.href }).catch(console.error);
        } else {
            prompt('Copia este enlace para compartir:', window.location.href);
        }
    });

    // ─── Navbar scroll ────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.style.background   = window.scrollY > 50 ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)';
        navbar.style.borderBottom = window.scrollY > 50 ? '1px solid var(--border-hover)' : '1px solid var(--border-gray)';
    });

    // ─── Fade-up observer ─────────────────────────────────────
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});
