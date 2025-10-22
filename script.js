// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. SMOOTH SCROLLING NAVIGATION
    // ============================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });

    // ============================================
    // 2. MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');

            if (mobileMenu) {
                mobileMenu.classList.toggle('active');
            }

            if (menuOverlay) {
                menuOverlay.classList.toggle('active');
            }

            // Prevent body scroll when menu is open
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            if (menuToggle) menuToggle.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            this.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // ============================================
    // 3. FORM VALIDATION
    // ============================================
    const forms = document.querySelectorAll('form[data-validate="true"]');

    // Validation rules
    const validationRules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
        },
        phone: {
            pattern: /^[\d\s\+\-\(\)]+$/,
            message: 'Bitte geben Sie eine gültige Telefonnummer ein.'
        },
        required: {
            message: 'Dieses Feld ist erforderlich.'
        }
    };

    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (isRequired && value === '') {
            isValid = false;
            errorMessage = validationRules.required.message;
        }
        // Validate email
        else if (fieldType === 'email' && value !== '') {
            if (!validationRules.email.pattern.test(value)) {
                isValid = false;
                errorMessage = validationRules.email.message;
            }
        }
        // Validate phone
        else if (fieldType === 'tel' && value !== '') {
            if (!validationRules.phone.pattern.test(value)) {
                isValid = false;
                errorMessage = validationRules.phone.message;
            }
        }

        // Display error message
        const errorElement = field.parentElement.querySelector('.error-message');

        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            } else {
                const newError = document.createElement('span');
                newError.className = 'error-message';
                newError.textContent = errorMessage;
                newError.style.color = 'red';
                newError.style.fontSize = '0.875rem';
                newError.style.marginTop = '0.25rem';
                newError.style.display = 'block';
                field.parentElement.appendChild(newError);
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }

        return isValid;
    }

    // Add validation to all forms
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        // Validate on blur
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            // Clear error on input
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorElement = this.parentElement.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
            });
        });

        // Validate on submit
        form.addEventListener('submit', function(e) {
            let isFormValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                e.preventDefault();
            }
        });
    });

    // ============================================
    // 4. TELEGRAM WIDGET INTEGRATION
    // ============================================
    function initTelegramWidget(config = {}) {
        const {
            username = 'your_telegram_username', // Default username
            containerId = 'telegram-widget',
            buttonSize = 'large',
            buttonColor = '#0088cc',
            buttonRadius = 10,
            buttonText = 'Auf Telegram kontaktieren'
        } = config;

        const container = document.getElementById(containerId);

        if (!container) {
            console.warn(`Telegram widget container with id "${containerId}" not found`);
            return;
        }

        // Create Telegram button
        const telegramButton = document.createElement('a');
        telegramButton.href = `https://t.me/${username}`;
        telegramButton.target = '_blank';
        telegramButton.rel = 'noopener noreferrer';
        telegramButton.className = 'telegram-button';
        telegramButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.499-.187.943.112.78.89z"/>
            </svg>
            ${buttonText}
        `;

        // Apply styles
        telegramButton.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background-color: ${buttonColor};
            color: white;
            padding: ${buttonSize === 'large' ? '12px 24px' : '8px 16px'};
            border-radius: ${buttonRadius}px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        `;

        // Add hover effect
        telegramButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 136, 204, 0.3)';
        });

        telegramButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        container.appendChild(telegramButton);
    }

    // Initialize Telegram widget with custom configuration
    // You can customize these values or read them from data attributes
    const telegramConfig = {
        username: document.querySelector('[data-telegram-username]')?.dataset.telegramUsername || 'your_telegram_username',
        containerId: 'telegram-widget',
        buttonSize: 'large',
        buttonColor: '#0088cc',
        buttonRadius: 10,
        buttonText: 'Auf Telegram kontaktieren'
    };

    initTelegramWidget(telegramConfig);

    // ============================================
    // 5. INTERSECTION OBSERVER ANIMATIONS
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate || 'fade-in';
                const delay = element.dataset.animateDelay || '0';

                setTimeout(() => {
                    element.classList.add('animated', animationType);
                }, parseInt(delay));

                // Optional: stop observing after animation
                if (element.dataset.animateOnce !== 'false') {
                    observer.unobserve(element);
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add CSS for animations if not already present
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            [data-animate] {
                opacity: 0;
                transition: all 0.6s ease-out;
            }

            [data-animate].animated.fade-in {
                opacity: 1;
            }

            [data-animate].animated.fade-up {
                opacity: 1;
                transform: translateY(0);
            }

            [data-animate]:not(.animated).fade-up {
                transform: translateY(30px);
            }

            [data-animate].animated.fade-down {
                opacity: 1;
                transform: translateY(0);
            }

            [data-animate]:not(.animated).fade-down {
                transform: translateY(-30px);
            }

            [data-animate].animated.fade-left {
                opacity: 1;
                transform: translateX(0);
            }

            [data-animate]:not(.animated).fade-left {
                transform: translateX(30px);
            }

            [data-animate].animated.fade-right {
                opacity: 1;
                transform: translateX(0);
            }

            [data-animate]:not(.animated).fade-right {
                transform: translateX(-30px);
            }

            [data-animate].animated.scale-in {
                opacity: 1;
                transform: scale(1);
            }

            [data-animate]:not(.animated).scale-in {
                transform: scale(0.9);
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // 6. FORM SUBMISSION HANDLING
    // ============================================
    const contactForms = document.querySelectorAll('form[data-submit]');

    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : '';

            // Disable submit button
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Wird gesendet...';
            }

            try {
                // Get submission endpoint from data attribute or use default
                const endpoint = this.dataset.submit || '/api/contact';

                // Send form data
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                if (response.ok) {
                    // Success handling
                    showFormMessage(this, 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
                    this.reset();
                } else {
                    // Error handling
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(this, 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
            } finally {
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    });

    function showFormMessage(form, message, type) {
        // Remove existing message
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 12px 16px;
            margin-top: 16px;
            border-radius: 8px;
            font-size: 0.875rem;
            background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;

        form.appendChild(messageElement);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }

    // ============================================
    // UTILITY: SCROLL TO TOP BUTTON (BONUS)
    // ============================================
    const scrollTopButton = document.querySelector('.scroll-to-top');

    if (scrollTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });

        scrollTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});

// ============================================
// EXPORT FOR MODULE USAGE (OPTIONAL)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export functions if needed for testing
    };
}
