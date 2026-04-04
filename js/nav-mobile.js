// nav-mobile.js — Menú hamburguesa móvil
(function () {
    function initMobileNav() {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;

        // Crear botón hamburguesa
        const btn = document.createElement('button');
        btn.className = 'nav-hamburger';
        btn.setAttribute('aria-label', 'Abrir menú');
        btn.innerHTML = `
            <span class="ham-bar"></span>
            <span class="ham-bar"></span>
            <span class="ham-bar"></span>`;
        navContainer.appendChild(btn);

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'nav-mobile-overlay';
        document.body.appendChild(overlay);

        // Crear drawer
        const navLinks = document.querySelector('.nav-links');
        const drawer = document.createElement('nav');
        drawer.className = 'nav-drawer';

        // Copiar los links al drawer
        if (navLinks) {
            drawer.innerHTML = navLinks.innerHTML;
        }
        document.body.appendChild(drawer);

        function openMenu() {
            btn.classList.add('open');
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            btn.classList.remove('open');
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        btn.addEventListener('click', () => {
            btn.classList.contains('open') ? closeMenu() : openMenu();
        });
        overlay.addEventListener('click', closeMenu);
        drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();
