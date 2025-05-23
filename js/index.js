// Documento principal JavaScript para la página de inicio

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el formulario de contacto
    initContactForm();
    
    // Inicializar efectos de desplazamiento suave
    initSmoothScroll();
    
    // Inicializar tooltips de Bootstrap
    initTooltips();
    
    // Activar la navegación activa
    initActiveNav();
    
    // Inicializar efectos del hero
    initHeroEffects();
    
    // Ajustar el hero para pantallas pequeñas
    handleHeroResponsive();
    
    // Inicializar videos del equipo
    initTeamVideos();
});

// Función para inicializar efectos del hero
function initHeroEffects() {
    const heroSection = document.getElementById('hero');
    
    if (heroSection) {
        
        // Agregar clase para activar animaciones después de un breve delay
        setTimeout(() => {
            heroSection.classList.add('loaded');
        }, 100);
        // Efecto fade out suave al hacer scroll (opcional)
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrolled < heroHeight) {
                const opacity = Math.max(0.3, 1 - (scrolled / heroHeight));
                heroSection.style.opacity = opacity;
            }
        });
    }
}

// Función para manejar la responsividad del hero
function handleHeroResponsive() {
    const heroSection = document.getElementById('hero');
    
    if (heroSection) {
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
            
            // Deshabilitar parallax en dispositivos móviles para mejor rendimiento
            if (windowWidth <= 768) {
                heroSection.style.backgroundAttachment = 'scroll';
            } else {
                heroSection.style.backgroundAttachment = 'fixed';
            }
            
            // IMPORTANTE: Resetear cualquier transform que pueda estar aplicado
            heroSection.style.transform = 'none';
        }
        
        // Ejecutar al cargar y al cambiar el tamaño de la ventana
        adjustHeroHeight();
        window.addEventListener('resize', adjustHeroHeight);
    }
}

// Función para inicializar todos los videos del equipo
function initTeamVideos() {
    // Detectar si es un dispositivo táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Inicializar videos con hover (miembros 3 y 5)
    initHoverVideos(isTouchDevice);
    
    // Inicializar videos automáticos (miembros 4 y 6)
    initAutoVideos();
}

// Función para inicializar videos con hover/touch
function initHoverVideos(isTouchDevice) {
    const hoverVideos = document.querySelectorAll('.hover-video');
    
    hoverVideos.forEach(video => {
        // Quitar autoplay si existe
        video.removeAttribute('autoplay');
        
        // Crear un contenedor wrapper si no existe
        if (!video.closest('.video-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-container';
            video.parentNode.insertBefore(wrapper, video);
            wrapper.appendChild(video);
        }
        
        const videoContainer = video.closest('.video-container') || video;
        
        if (isTouchDevice) {
            // Para dispositivos táctiles (tablets/celulares)
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
                    video.currentTime = 0;
                    isPlaying = false;
                }
            };
            
            videoContainer.addEventListener('touchstart', toggleVideo);
            videoContainer.addEventListener('click', toggleVideo);
            
            // Manejar cuando el video termina
            video.addEventListener('ended', function() {
                isPlaying = false;
            });
            
        } else {
            // Para dispositivos con mouse (desktop)
            videoContainer.addEventListener('mouseenter', function() {
                video.play().catch(error => {
                    console.log('Error al reproducir video:', error);
                });
            });
            
            videoContainer.addEventListener('mouseleave', function() {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
}

// Función para inicializar videos automáticos
function initAutoVideos() {
    const autoVideos = document.querySelectorAll('.auto-video');
    
    autoVideos.forEach(video => {
        // Asegurar que tienen autoplay, loop y muted
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        
        // Intentar reproducir inmediatamente
        video.play().catch(error => {
            console.log('Error al reproducir video automático:', error);
        });
        
        // Manejar cuando el video está listo para reproducir
        video.addEventListener('canplay', function() {
            video.play().catch(error => {
                console.log('Error al reproducir video cuando está listo:', error);
            });
        });
    });
}

// Función para inicializar el formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Validación básica mejorada
            if (!nombre.trim() || !email.trim() || !asunto.trim() || !mensaje.trim()) {
                showAlert('Por favor, completa todos los campos obligatorios.', 'warning');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Por favor, ingresa un email válido.', 'warning');
                return;
            }
            
            // Mostrar mensaje de carga
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            submitButton.disabled = true;
            
            // Simular tiempo de procesamiento
            setTimeout(function() {
                // Mostrar mensaje de éxito
                showAlert(`¡Mensaje enviado exitosamente! Gracias ${nombre}, nos pondremos en contacto contigo pronto.`, 'success');
                
                // Restaurar el botón
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Resetear el formulario
                contactForm.reset();
                
                // En un caso real, aquí enviarías los datos al servidor
                console.log('Formulario enviado:', { nombre, email, telefono, asunto, mensaje });
                
            }, 1500);
        });
    }
}

// Función para mostrar alertas mejoradas
function showAlert(message, type = 'info') {
    // Crear el elemento de alerta
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
    
    // Agregar al body
    document.body.appendChild(alertDiv);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Función para inicializar el desplazamiento suave
function initSmoothScroll() {
    // Seleccionar todos los enlaces que apuntan a anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el destino
            const targetId = this.getAttribute('href');
            
            // Si el destino es "#", no hacer nada
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calcular offset dinámicamente basado en la navbar
                const navbar = document.querySelector('.navbar');
                const offset = navbar ? navbar.offsetHeight + 20 : 80;
                
                // Desplazamiento suave mejorado
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                const navbarToggler = document.querySelector('.navbar-toggler');
                
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    if (navbarToggler) {
                        navbarToggler.click();
                    }
                }
            }
        });
    });
}

// Función para inicializar tooltips de Bootstrap
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para activar la navegación actual
function initActiveNav() {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    if (currentLocation.endsWith('/') || currentLocation.endsWith('index.html')) {
        // Detector de scroll mejorado con throttle para mejor rendimiento
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
        
        // Establecer enlace activo inicial
        highlightNavOnScroll();
    } else {
        // Para otras páginas
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath && currentLocation.includes(linkPath)) {
                link.classList.add('active');
            }
        });
    }
}

// Función para resaltar la navegación según el scroll
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
            // Remover 'active' de todos los enlaces
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Agregar 'active' al enlace correspondiente
            const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Función para inicializar el carousel si existe
if (document.querySelector('.carousel')) {
    new bootstrap.Carousel(document.querySelector('.carousel'), {
        interval: 5000,
        touch: true,
        wrap: true
    });
}

// Animación para los números en la sección de estadísticas
function animateStats() {
    const statsElements = document.querySelectorAll('.stats-number');
    
    if (statsElements.length > 0) {
        statsElements.forEach(element => {
            const targetValue = parseInt(element.getAttribute('data-value'));
            let currentValue = 0;
            const duration = 2000;
            const frameRate = 60;
            const totalFrames = duration / 1000 * frameRate;
            const increment = targetValue / totalFrames;
            
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    element.textContent = targetValue;
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(currentValue);
                }
            }, 1000 / frameRate);
        });
    }
}

// Observador de intersección mejorado
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animación de estadísticas
            if (entry.target.classList.contains('stats-container')) {
                animateStats();
            }
            
            // Animación de fade-in
            if (entry.target.classList.contains('fade-in')) {
                entry.target.classList.add('animated');
            }
            
            // Animación de cards
            if (entry.target.classList.contains('card')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
            
            // Dejar de observar después de la animación
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Observar elementos con animaciones
    document.querySelectorAll('.fade-in, .stats-container').forEach(element => {
        observer.observe(element);
    });
    
    // Preparar cards para animación
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});

// Optimización para dispositivos táctiles
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Precargar la imagen del hero para mejor rendimiento
function preloadHeroImage() {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const img = new Image();
        img.src = 'assets/hero.jpg';
        img.onload = function() {
            heroSection.classList.add('hero-loaded');
        };
    }
}

// Ejecutar precarga
preloadHeroImage();