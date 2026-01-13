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
    
    if (nav) {
        nav.classList.toggle('mobile-active');
    }
    if (mobileBtn) {
        mobileBtn.classList.toggle('active');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
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
    if (!header) return;
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

// Función para actualizar el carrusel (CORREGIDA PARA CENTRADO PERFECTO)
function updateCarousel() {
    const wrapper = document.querySelector('.testimonios-carousel'); // Contenedor visible
    const container = document.getElementById('testimoniosContainer'); // Tira flexible
    const cards = container.querySelectorAll('.testimonio-card');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!wrapper || !container || cards.length === 0) return;

    // Obtener dimensiones actuales
    const wrapperWidth = wrapper.offsetWidth;
    const card = cards[0];
    const cardWidth = card.offsetWidth;
    
    // Obtener el gap computado
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.gap) || 32; // Fallback a 2rem (32px) si falla el parseo
    
    const fullCardWidth = cardWidth + gap;

    // LÓGICA DE CENTRADO MATEMÁTICO:
    // Offset = (Centro del Wrapper) - (Mitad de la Card) - (Posición de la Card en la tira)
    const centerOffset = (wrapperWidth / 2) - (cardWidth / 2);
    const positionOffset = currentTestimonioIndex * fullCardWidth;
    const finalTranslate = centerOffset - positionOffset;
    
    // Aplicar transformación
    container.style.transform = `translateX(${finalTranslate}px)`;
    
    // Actualizar clases de las cards para efectos visuales
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
    
    // Limpiar indicadores existentes para evitar duplicados si se llama múltiples veces
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = ''; 
        
        // Crear indicadores
        for (let i = 0; i < totalTestimonios; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.onclick = () => goToTestimonio(i);
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Inicializar posición
    // Pequeño timeout para asegurar que el DOM ha renderizado estilos
    setTimeout(updateCarousel, 100);
    
    // Auto-play del carrusel (reinicia el timer si el usuario interactúa manualmente podría mejorarse, pero básico funcional)
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
            
            const nav = document.querySelector('.nav');
            if (nav && nav.classList.contains('mobile-active')) {
                toggleMobileMenu();
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        handleScrollAnimations();
        handleHeaderScroll();
    });
    
    // Recalcular carrusel al cambiar tamaño de ventana (CRÍTICO PARA RESPONSIVE)
    window.addEventListener('resize', updateCarousel);
    
    handleScrollAnimations();
    initCarousel();
    
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('.nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav && nav.classList.contains('mobile-active') && 
            !nav.contains(e.target) && 
            (mobileBtn && !mobileBtn.contains(e.target))) {
            toggleMobileMenu();
        }
    });
    
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

    setupFormValidation();
    
    const phoneInput = document.getElementById('telefono');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }

    // Tracking simple
    document.querySelectorAll('[onclick*="abrirWhatsApp"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Contact', 'WhatsApp Click', btn.textContent.trim());
        });
    });
    
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('Contact', 'Form Submit', 'Contact Form');
        });
    }
});

function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

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
    let isValid = value !== '';
    
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

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.substring(0, 10);
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    input.value = value;
}

function isMobile() {
    return window.innerWidth <= 768;
}

if (isMobile()) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, window.scrollY);
            updateCarousel(); // Recalcular carrusel al rotar
        }, 100);
    });
}

function trackEvent(category, action, label) {
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

function updateMetaTags() {
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

window.addEventListener('scroll', updateMetaTags);

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
    
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
}
