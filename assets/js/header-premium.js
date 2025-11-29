/* ═══════════════════════════════════════════════════════════════
   HEADER PREMIUM - JavaScript
   AI & Beyond - Navigation Premium
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ═══════════════════════════════════════════════════════════
    // Éléments du DOM
    // ═══════════════════════════════════════════════════════════
    
    const header = document.querySelector('.header-premium');
    const menuToggle = document.querySelector('.menu-toggle-premium');
    const navMenu = document.querySelector('.nav-menu-premium');
    const navLinks = document.querySelectorAll('.nav-link-premium');
    const navOverlay = document.querySelector('.nav-overlay');
    
    // ═══════════════════════════════════════════════════════════
    // Effet de scroll sur le header
    // ═══════════════════════════════════════════════════════════
    
    let lastScroll = 0;
    const scrollThreshold = 50;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Ajouter classe "scrolled" après threshold
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    // Écouter le scroll avec throttle pour performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // ═══════════════════════════════════════════════════════════
    // Toggle du menu mobile
    // ═══════════════════════════════════════════════════════════
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
            
            // Bloquer le scroll du body quand menu ouvert
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navOverlay) {
                    navOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            });
        });
        
        // Fermer le menu quand on clique sur l'overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // Lien actif basé sur la page courante
    // ═══════════════════════════════════════════════════════════
    
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            const linkPage = href.split('/').pop();
            
            // Correspondance exacte ou index
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && href === '/' || href === '../index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveLink();
    
    // ═══════════════════════════════════════════════════════════
    // Animation smooth pour les liens internes
    // ═══════════════════════════════════════════════════════════
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si c'est un lien avec ancre sur la même page
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════
    // Fermer menu mobile avec Escape
    // ═══════════════════════════════════════════════════════════
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navOverlay) {
                navOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
    
    // ═══════════════════════════════════════════════════════════
    // Initialisation
    // ═══════════════════════════════════════════════════════════
    
    // Vérifier le scroll initial
    handleScroll();
    
    console.log('✨ Header Premium initialized');
});
