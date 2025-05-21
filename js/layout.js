// Función para cargar componentes HTML
function loadComponent(url, elementId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el componente: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            
            // Configurar rutas correctas después de cargar los componentes
            configureLinks();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para configurar las rutas correctas de los enlaces
function configureLinks() {
    // Determinar si estamos en una subcarpeta
    const isInSubfolder = window.location.pathname.includes('/posts/');
    const basePath = isInSubfolder ? '../' : '';
    
    // Configurar el enlace del logo (siempre a la página de inicio)
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.setAttribute('href', basePath + 'index.html');
    }
    
    // Configurar enlaces de navegación
    const navLinks = {
        'nosotrosLink': 'nosotros',
        'serviciosLink': 'servicios',
        'faqLink': 'faq',
        'articulosLink': 'articulos',
        'contactoLink': 'contacto'
    };
    
    for (const [linkId, sectionId] of Object.entries(navLinks)) {
        const linkElement = document.getElementById(linkId);
        if (linkElement) {
            if (linkId === 'articulosLink') {
                // El enlace a artículos siempre va a la página de artículos
                linkElement.setAttribute('href', basePath + 'posts/articulos.html');
            } else {
                // Los demás enlaces van a secciones en la página principal
                if (isInSubfolder) {
                    // Si estamos en una subcarpeta, los enlaces de secciones van a la página principal + el ancla
                    linkElement.setAttribute('href', basePath + 'index.html#' + sectionId);
                } else {
                    // Si estamos en la página principal, los enlaces van directamente a las anclas
                    linkElement.setAttribute('href', '#' + sectionId);
                }
            }
        }
    }
}

// Cargar el header y footer una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    
    // Determinar la ruta base según la ubicación actual
    const basePath = window.location.pathname.includes('/posts/') ? '../' : '';
    
    // Cargar componentes si existen los contenedores
    if (headerContainer) {
        loadComponent(basePath + 'components/header.html', 'header-container');
    }
    
    if (footerContainer) {
        loadComponent(basePath + 'components/footer.html', 'footer-container');
    }
});