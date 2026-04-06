document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Hamburger Menu ---
    const hamburger = document.getElementById('navHamburger');
    const drawer    = document.getElementById('navDrawer');
    const overlay   = document.getElementById('navOverlay');

    function openMenu() {
        hamburger && hamburger.classList.add('open');
        drawer    && drawer.classList.add('open');
        overlay   && overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger && hamburger.classList.remove('open');
        drawer    && drawer.classList.remove('open');
        overlay   && overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close drawer when a link inside it is clicked
    if (drawer) {
        drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    }



    // Render dynamic inventory
    const catalogGrid = document.getElementById('catalogGrid');
    if (catalogGrid && typeof CAR_INVENTORY !== 'undefined') {
        CAR_INVENTORY.forEach(car => {
            const cardHTML = `
                <div class="car-card fade-up">
                    <div class="card-img-wrapper">
                        <img src="${car.image}" alt="${car.make} ${car.model}">
                    </div>
                    <div class="card-info">
                        <h3>${car.make} ${car.model}</h3>
                        <div class="card-tags">
                            <span class="tag">${car.year}</span>
                            <span class="tag">${car.kilometers}</span>
                        </div>
                    </div>
                </div>
            `;
            catalogGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // ─── Scroll Animations con stagger ───────────────────
    const ANIM_SELECTOR = '.fade-up, .anim-up, .anim-left, .anim-right, .anim-scale, .anim-fade';
    const STAGGER_PARENTS = '.catalog-grid, .home-carousel-container, .home-brands-grid, .reasons-grid, .footer-grid';

    // Aplica delay escalonado a los hijos directos de contenedores
    document.querySelectorAll(STAGGER_PARENTS).forEach(parent => {
        [...parent.children].forEach((child, i) => {
            child.style.setProperty('--anim-delay', `${i * 0.08}s`);
        });
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(ANIM_SELECTOR).forEach(el => observer.observe(el));

    // Navbar background blur on scroll adjustmenet (optional enhancement)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.borderBottom = '1px solid var(--border-hover)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.6)';
            navbar.style.borderBottom = '1px solid var(--border-gray)';
        }
    });

});
