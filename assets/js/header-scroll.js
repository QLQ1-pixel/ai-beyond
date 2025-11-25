/* ═══════════════════════════════════════════════════════════════
   HEADER SMART-HIDE BEHAVIOR
   Gestion intelligente du header au scroll
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        scrollThreshold: 100,    // Pixels de scroll avant activation
        debounceDelay: 10,       // Délai de debounce pour performance
        mobileBreakpoint: 768    // Breakpoint mobile
    };
    
    // État
    let lastScroll = 0;
    let ticking = false;
    const header = document.querySelector('header');
    
    // Vérifier si on est sur mobile
    function isMobile() {
        return window.innerWidth < CONFIG.mobileBreakpoint;
    }
    
    // Fonction principale de gestion du scroll
    function updateHeader(currentScroll) {
        // Sur mobile, garder toujours compact
        if (isMobile()) {
            header.classList.add('header-compact');
            return;
        }
        
        // Desktop logic
        if (currentScroll > CONFIG.scrollThreshold) {
            // Scroll down - compacter le header
            if (currentScroll > lastScroll) {
                header.classList.add('header-compact');
            }
            // Scroll up - garder compact mais visible
            else {
                // Réexpandre uniquement si on remonte vers le haut
                if (currentScroll < CONFIG.scrollThreshold * 1.5) {
                    header.classList.remove('header-compact');
                }
            }
        } else {
            // Haut de page - état initial complet
            header.classList.remove('header-compact');
        }
        
        lastScroll = currentScroll;
    }
    
    // Optimisation avec requestAnimationFrame
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                updateHeader(currentScroll);
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        updateHeader(currentScroll);
    });
    
    // État initial
    document.addEventListener('DOMContentLoaded', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        updateHeader(currentScroll);
    });
    
    // Debug mode (décommenter pour activer)
    // window.headerDebug = () => {
    //     console.log('Scroll:', lastScroll, 'Compact:', header.classList.contains('header-compact'));
    // };
    
})();

/* ═══════════════════════════════════════════════════════════════
   MOBILE MENU TOGGLE
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Fermer le menu quand on clique sur un lien
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
});
