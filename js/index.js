// JavaScript optimizado para la página de inicio

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades esenciales
    initContactForm();
    initSmoothScroll();
    initActiveNav();
    initHeroEffects();
    initTeamVideos();
    
    // Configurar observador de intersección para animaciones
    setupIntersectionObserver();
});

// === EFECTOS DEL HERO ===
function initHeroEffects() {
    const heroSection = document.getElementById('hero');
    
    if (!heroSection) return;
    
    // Activar animaciones después de un breve delay
    setTimeout(() => {
        heroSection.classList.add('loaded');
    }, 100);
    
    // Ajustar responsividad del hero
    handleHeroResponsive();
}

function handleHeroResponsive() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    function adjustHeroHeight() {
        const windowWidth = window.innerWidth;
        
        // Ajustar altura mínima según el dispositivo
        if (windowWidth <= 576) {
            heroSection.style.minHeight = '80vh';
        } else if (windowWidth <= 768) {
            heroSection.style.minHeight = '85vh';
        } else if (windowWidth <= 992) {
            heroSection.style.minHeight = '90vh';
        } else {
            heroSection.style.minHeight = '100vh';
        }
        
        // Deshabilitar parallax en móviles para mejor rendimiento
        heroSection.style.backgroundAttachment = windowWidth <= 768 ? 'scroll' : 'fixed';
        heroSection.style.transform = 'none';
    }
    
    adjustHeroHeight();
    window.addEventListener('resize', adjustHeroHeight);
}

// === VIDEOS DEL EQUIPO ===
function initTeamVideos() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    initHoverVideos(isTouchDevice);
    initAutoVideos();
}

function initHoverVideos(isTouchDevice) {
    const hoverVideos = document.querySelectorAll('.hover-video');
    
    hoverVideos.forEach(video => {
        video.removeAttribute('autoplay');
        
        const videoContainer = video.closest('.video-container') || video;
        
        if (isTouchDevice) {
            // Para dispositivos táctiles - toggle play/pause
            let isPlaying = false;
            
            const toggleVideo = function(e) {
                e.preventDefault();
                
                if (!isPlaying) {
                    video.play().then(() => {
                        isPlaying = true;
                    }).catch(error => {
                        console.log('Error al reproducir video:', error);
                    });
                } else {
                    video.pause();
                    isPlaying = false;
                }
            };
            
            videoContainer.addEventListener('touchstart', toggleVideo);
            videoContainer.addEventListener('click', toggleVideo);
            
            video.addEventListener('ended', () => isPlaying = false);
            video.addEventListener('pause', () => isPlaying = false);
            
        } else {
            // Para desktop - pausar/continuar en hover (MEJORA SOLICITADA)
            videoContainer.addEventListener('mouseenter', function() {
                video.play().catch(error => {
                    console.log('Error al reproducir video:', error);
                });
            });
            
            videoContainer.addEventListener('mouseleave', function() {
                // CAMBIO: Solo pausar, no resetear el tiempo
                video.pause();
                // video.currentTime = 0; // ← ELIMINADO - ahora continúa desde donde pausó
            });
        }
    });
}

function initAutoVideos() {
    const autoVideos = document.querySelectorAll('.auto-video');
    
    autoVideos.forEach(video => {
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        
        video.play().catch(error => {
            console.log('Error al reproducir video automático:', error);
        });
        
        video.addEventListener('canplay', function() {
            video.play().catch(error => {
                console.log('Error al reproducir video cuando está listo:', error);
            });
        });
    });
}

// === FORMULARIO DE CONTACTO ===
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            asunto: document.getElementById('asunto').value.trim(),
            mensaje: document.getElementById('mensaje').value.trim()
        };
        
        // Validación
        if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
            showAlert('Por favor, completa todos los campos obligatorios.', 'warning');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('Por favor, ingresa un email válido.', 'warning');
            return;
        }
        
        // Procesar envío
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        submitButton.disabled = true;
        
        setTimeout(function() {
            showAlert(`¡Mensaje enviado exitosamente! Gracias ${formData.nombre}, nos pondremos en contacto contigo pronto.`, 'success');
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            contactForm.reset();
            
            console.log('Formulario enviado:', formData);
        }, 1500);
    });
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// === NAVEGACIÓN ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navbar = document.querySelector('.navbar');
            const offset = navbar ? navbar.offsetHeight + 20 : 80;
            const targetPosition = targetElement.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');
            
            if (navbarCollapse?.classList.contains('show') && navbarToggler) {
                navbarToggler.click();
            }
        });
    });
}

function initActiveNav() {
    const currentLocation = window.location.pathname;
    
    if (currentLocation.endsWith('/') || currentLocation.endsWith('index.html')) {
        // Detector de scroll con throttle
        let ticking = false;
        
        function updateActiveNav() {
            highlightNavOnScroll();
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateActiveNav);
                ticking = true;
            }
        });
        
        highlightNavOnScroll();
    } else {
        // Para otras páginas
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath && currentLocation.includes(linkPath)) {
                link.classList.add('active');
            }
        });
    }
}

function highlightNavOnScroll() {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 50;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// === ANIMACIONES CON INTERSECTION OBSERVER ===
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animación de cards
                if (entry.target.classList.contains('card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Preparar y observar cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// === OPTIMIZACIONES ===
// Detectar dispositivos táctiles
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Precargar imagen del hero
function preloadHeroImage() {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const img = new Image();
        img.src = 'assets/hero.jpg';
        img.onload = () => heroSection.classList.add('hero-loaded');
    }
}

preloadHeroImage();