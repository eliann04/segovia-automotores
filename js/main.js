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

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

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

    // --- Carrusel deslizable con el dedo (solo mobile) ---
    const carousel = document.getElementById('home-vehicles-carousel');
    if (carousel && 'ontouchstart' in window) {
        let startX = 0;
        let startY = 0;
        let scrollLeft = 0;
        let isSwiping = false;

        carousel.addEventListener('touchstart', (e) => {
            startX     = e.touches[0].clientX;
            startY     = e.touches[0].clientY;
            scrollLeft = carousel.scrollLeft;
            isSwiping  = false;
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;

            // Solo actuar si el gesto es más horizontal que vertical
            if (!isSwiping && Math.abs(dx) > Math.abs(dy) + 5) {
                isSwiping = true;
            }

            if (isSwiping) {
                carousel.scrollLeft = scrollLeft - dx;
            }
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            isSwiping = false;
        }, { passive: true });
    }

});
