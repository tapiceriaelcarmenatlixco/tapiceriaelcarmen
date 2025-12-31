// Configuración de WhatsApp
const WHATSAPP_NUMBER = '5212441130181';

// Variables del carrusel de testimonios
let currentTestimonioIndex = 0;
const totalTestimonios = 6;

// Función para abrir WhatsApp con mensaje predeterminado
function abrirWhatsApp(mensaje = '') {
    const mensajeDefault = mensaje || 'Hola, me interesa información sobre sus servicios de tapicería';
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(mensajeDefault)}`;
    window.open(url, '_blank');
}

// Función para enviar formulario por WhatsApp
function enviarWhatsApp(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const nombre = formData.get('nombre');
    const telefono = formData.get('telefono');
    const servicio = formData.get('servicio');
    const mensaje = formData.get('mensaje');
    
    // Validar campos requeridos
    if (!nombre || !telefono || !servicio) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }
    
    // Crear mensaje para WhatsApp
    let mensajeWhatsApp = `¡Hola! Me interesa solicitar información sobre sus servicios.\n\n`;
    mensajeWhatsApp += `👤 *Nombre:* ${nombre}\n`;
    mensajeWhatsApp += `📱 *Teléfono:* ${telefono}\n`;
    mensajeWhatsApp += `🛋️ *Servicio:* ${getServiceName(servicio)}\n`;
    
    if (mensaje) {
        mensajeWhatsApp += `📝 *Detalles:* ${mensaje}\n`;
    }
    
    mensajeWhatsApp += `\nGracias por su atención. Espero su respuesta.`;
    
    // Abrir WhatsApp
    abrirWhatsApp(mensajeWhatsApp);
    
    // Limpiar formulario
    form.reset();
    
    // Mostrar mensaje de confirmación
    showNotification('Mensaje enviado a WhatsApp correctamente', 'success');
}

// Función para obtener el nombre del servicio
function getServiceName(serviceValue) {
    const services = {
        'retapizado-sofa': 'Retapizado de sofá',
        'tapizado-sillas': 'Tapizado de sillas',
        'cabeceras': 'Cabeceras personalizadas',
        'asientos-moto': 'Asientos de moto',
        'muebles-medida': 'Muebles a medida',
        'otro': 'Otro servicio'
    };
    return services[serviceValue] || serviceValue;
}

// Función para toggle FAQ
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Cerrar todas las FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir la FAQ clickeada si no estaba activa
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Función para toggle menú móvil
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    nav.classList.toggle('mobile-active');
    mobileBtn.classList.toggle('active');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left: 4px solid #10B981;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-success i {
                color: #10B981;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función para scroll suave
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Función para animaciones al hacer scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.servicio-card, .testimonio-card, .stat-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

// Función para cambiar el header al hacer scroll
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--blanco-puro)';
        header.style.backdropFilter = 'none';
    }
}

// Función para mover el carrusel de testimonios
function moveCarousel(direction) {
    currentTestimonioIndex += direction;
    
    if (currentTestimonioIndex < 0) {
        currentTestimonioIndex = totalTestimonios - 1;
    } else if (currentTestimonioIndex >= totalTestimonios) {
        currentTestimonioIndex = 0;
    }
    
    updateCarousel();
}

// Función para actualizar el carrusel
function updateCarousel() {
    const container = document.getElementById('testimoniosContainer');
    const cards = container.querySelectorAll('.testimonio-card');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Calcular el desplazamiento
    const cardWidth = 300 + 24; // ancho de card + gap
    const offset = currentTestimonioIndex * cardWidth;
    
    // Aplicar transformación
    container.style.transform = `translateX(-${offset}px)`;
    
    // Actualizar clases de las cards
    cards.forEach((card, index) => {
        card.classList.remove('active', 'side');
        
        if (index === currentTestimonioIndex) {
            card.classList.add('active');
        } else if (
            index === currentTestimonioIndex - 1 || 
            index === currentTestimonioIndex + 1 ||
            (currentTestimonioIndex === 0 && index === totalTestimonios - 1) ||
            (currentTestimonioIndex === totalTestimonios - 1 && index === 0)
        ) {
            card.classList.add('side');
        }
    });
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentTestimonioIndex);
    });
}

// Función para ir a un testimonio específico
function goToTestimonio(index) {
    currentTestimonioIndex = index;
    updateCarousel();
}

// Función para inicializar el carrusel
function initCarousel() {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    // Crear indicadores
    for (let i = 0; i < totalTestimonios; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.onclick = () => goToTestimonio(i);
        indicatorsContainer.appendChild(indicator);
    }
    
    // Inicializar posición
    updateCarousel();
    
    // Auto-play del carrusel
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // ------------------------------------------
    // ACTUALIZACIÓN DE AÑO (COPYRIGHT)
    // ------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    // ------------------------------------------

    // Manejar clicks en enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
            
            // Cerrar menú móvil si está abierto
            const nav = document.querySelector('.nav');
            if (nav.classList.contains('mobile-active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Manejar scroll
    window.addEventListener('scroll', function() {
        handleScrollAnimations();
        handleHeaderScroll();
    });
    
    // Ejecutar animaciones iniciales
    handleScrollAnimations();
    
    // Inicializar carrusel de testimonios
    initCarousel();
    
    // Manejar clicks fuera del menú móvil
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('.nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav.classList.contains('mobile-active') && 
            !nav.contains(e.target) && 
            !mobileBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Lazy loading para imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Función para validar formulario en tiempo real
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (field.type === 'tel') {
        const phoneRegex = /^[0-9]{10}$/;
        isValid = phoneRegex.test(value.replace(/\s/g, ''));
    }
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }
    
    return isValid;
}

// Inicializar validación del formulario
document.addEventListener('DOMContentLoaded', setupFormValidation);

// Función para formatear número de teléfono
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.substring(0, 10);
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    input.value = value;
}

// Agregar formato automático al campo de teléfono
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('telefono');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Optimizaciones para móvil
if (isMobile()) {
    // Reducir animaciones en móvil para mejor rendimiento
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    // Manejar orientación
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, window.scrollY);
        }, 100);
    });
}

// Función para analytics (placeholder)
function trackEvent(category, action, label) {
    // Aquí se puede integrar Google Analytics o similar
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Trackear eventos importantes
document.addEventListener('DOMContentLoaded', function() {
    // Trackear clicks en botones de WhatsApp
    document.querySelectorAll('[onclick*="abrirWhatsApp"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Contact', 'WhatsApp Click', btn.textContent.trim());
        });
    });
    
    // Trackear envío de formulario
    document.getElementById('contactForm').addEventListener('submit', () => {
        trackEvent('Contact', 'Form Submit', 'Contact Form');
    });
});

// Función para mejorar SEO
function updateMetaTags() {
    // Actualizar título basado en la sección visible
    const sections = document.querySelectorAll('section[id]');
    let currentSection = 'inicio';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
        }
    });
    
    const titles = {
        'inicio': 'Tapicería El Carmen - Tapizados a tu medida en Atlixco, Puebla',
        'servicios': 'Servicios de Tapicería - Retapizado de Sofás y Sillas | El Carmen',
        'nosotros': 'Sobre Nosotros - Tapicería El Carmen | 15+ Años de Experiencia',
        'contacto': 'Contacto - Tapicería El Carmen | Atlixco, Puebla'
    };
    
    if (titles[currentSection]) {
        document.title = titles[currentSection];
    }
}

// Actualizar meta tags al hacer scroll
window.addEventListener('scroll', updateMetaTags);

// Función para enviar mensaje simplificado por WhatsApp
function enviarWhatsAppSimple(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    
    if (!nombre || !descripcion) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const mensaje = `Hola, soy ${nombre}. ${descripcion}`;
    const numeroWhatsApp = '522441130181';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
    
    // Limpiar formulario
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
}