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
});

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
            
            // Aquí normalmente enviarías los datos a un servidor
            // En este ejemplo, simularemos un envío exitoso
            
            // Mostrar mensaje de carga
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            submitButton.disabled = true;
            
            // Simular tiempo de procesamiento
            setTimeout(function() {
                // Crear un mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success mt-3';
                successMessage.role = 'alert';
                successMessage.innerHTML = `
                    <h4 class="alert-heading">¡Mensaje enviado!</h4>
                    <p>Gracias por contactarnos, ${nombre}. Nos pondremos en contacto contigo a la brevedad.</p>
                `;
                
                // Insertar el mensaje después del formulario
                contactForm.appendChild(successMessage);
                
                // Restaurar el botón
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Resetear el formulario
                contactForm.reset();
                
                // Desaparecer el mensaje después de 5 segundos
                setTimeout(function() {
                    successMessage.remove();
                }, 5000);
                
                // En un caso real, aquí enviarías los datos al servidor con fetch() o XMLHttpRequest
                console.log('Formulario enviado:', { nombre, email, telefono, asunto, mensaje });
                
            }, 1500);
        });
    }
}

// Función para inicializar el desplazamiento suave
function initSmoothScroll() {
    // Seleccionar todos los enlaces que apuntan a anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el destino
            const targetId = this.getAttribute('href');
            
            // Si el destino es "#", no hacer nada (podría ser un botón de colapso)
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Desplazamiento suave
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajustar para el header fijo
                    behavior: 'smooth'
                });
                
                // Si estamos en móvil y el menú está abierto, cerrarlo
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
}

// Función para inicializar tooltips de Bootstrap
function initTooltips() {
    // Activar todos los tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para activar la navegación actual
function initActiveNav() {
    // Obtener la ubicación actual
    const currentLocation = window.location.pathname;
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Si estamos en la página principal
    if (currentLocation.endsWith('/') || currentLocation.endsWith('index.html')) {
        // Agregar detector de scroll para actualizar enlaces activos según la sección visible
        window.addEventListener('scroll', highlightNavOnScroll);
        
        // Llamar una vez al cargar para establecer el enlace activo inicial
        highlightNavOnScroll();
    } else {
        // Para otras páginas, marcar el enlace correspondiente como activo
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Si el enlace contiene la ruta actual, marcarlo como activo
            if (linkPath && currentLocation.includes(linkPath)) {
                link.classList.add('active');
            }
        });
    }
}

// Función para resaltar la navegación según el scroll
function highlightNavOnScroll() {
    // Obtener la posición actual del scroll
    const scrollPosition = window.scrollY;
    
    // Obtener todas las secciones
    const sections = document.querySelectorAll('section[id]');
    
    // Recorrer las secciones para encontrar la que está actualmente visible
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Ajuste para el header
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Si la posición de scroll está dentro de esta sección
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
        touch: true
    });
}

// Animación para los números en la sección de estadísticas (si existe)
function animateStats() {
    const statsElements = document.querySelectorAll('.stats-number');
    
    if (statsElements.length > 0) {
        statsElements.forEach(element => {
            const targetValue = parseInt(element.getAttribute('data-value'));
            let currentValue = 0;
            const duration = 2000; // 2 segundos
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

// Observador de intersección para activar las animaciones cuando los elementos son visibles
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Si el elemento tiene la clase 'stats-container', iniciar la animación de estadísticas
            if (entry.target.classList.contains('stats-container')) {
                animateStats();
            }
            
            // Agregar clase para animación de fade-in
            entry.target.classList.add('animated');
            
            // Dejar de observar después de la animación
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

// Observar elementos con la clase 'fade-in'
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Observar el contenedor de estadísticas si existe
const statsContainer = document.querySelector('.stats-container');
if (statsContainer) {
    observer.observe(statsContainer);
}