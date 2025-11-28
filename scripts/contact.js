// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    
    // Get current language
    function getCurrentLanguage() {
        return document.body.classList.contains('arabic') ? 'ar' : 'en';
    }
    
    // Get localized messages
    function getMessage(key) {
        const messages = {
            'validation': {
                'en': 'Please fill in all required fields',
                'ar': 'يرجى ملء جميع الحقول المطلوبة'
            },
            'success': {
                'en': 'Thank you for your message! We will get back to you soon.',
                'ar': 'شكرًا لرسالتك! سنتواصل معك قريبًا.'
            },
            'error': {
                'en': 'Sorry, there was an error sending your message. Please try again later.',
                'ar': 'عذرًا، حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقًا.'
            },
            'sending': {
                'en': 'Sending...',
                'ar': 'جاري الإرسال...'
            }
        };
        return messages[key] ? messages[key][getCurrentLanguage()] : '';
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const serviceInput = document.getElementById('service');
            const messageInput = document.getElementById('message');
            
            // Check if all required elements exist
            if (!nameInput || !emailInput || !messageInput) {
                console.error('Form elements not found');
                showFormMessage(getMessage('error'), 'error');
                return;
            }
            
            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput ? phoneInput.value.trim() : '',
                service: serviceInput ? serviceInput.value : '',
                message: messageInput.value.trim()
            };
            
            // Simple validation
            if (!formData.name || !formData.email || !formData.message) {
                showFormMessage(getMessage('validation'), 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                const errorMsg = getCurrentLanguage() === 'ar' 
                    ? 'يرجى إدخال عنوان بريد إلكتروني صحيح'
                    : 'Please enter a valid email address';
                showFormMessage(errorMsg, 'error');
                return;
            }
            
            // Disable submit button and show loading state
            const originalText = submitButton ? submitButton.textContent : '';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = getMessage('sending');
            }
            
            try {
                // Format service names
                const serviceNames = {
                    'industrial': getCurrentLanguage() === 'ar' ? 'مستلزمات المصانع' : 'Industrial Supplies',
                    'structures': getCurrentLanguage() === 'ar' ? 'المنشآت المعدنية' : 'Steel Structures',
                    'welding': getCurrentLanguage() === 'ar' ? 'خدمات اللحام' : 'Welding Services',
                    'kitchen': getCurrentLanguage() === 'ar' ? 'تجهيزات المطابخ' : 'Kitchen Equipment',
                    'piping': getCurrentLanguage() === 'ar' ? 'أنظمة المواسير' : 'Piping Systems',
                    'tanks': getCurrentLanguage() === 'ar' ? 'الخزانات والتنكات' : 'Tanks & Reservoirs',
                    'ladders': getCurrentLanguage() === 'ar' ? 'السلالم' : 'Ladders'
                };
                
                const serviceText = formData.service ? (serviceNames[formData.service] || formData.service) : (getCurrentLanguage() === 'ar' ? 'غير محدد' : 'Not specified');
                
                // Format WhatsApp message
                let whatsappMessage = '';
                if (getCurrentLanguage() === 'ar') {
                    whatsappMessage = `🔔 *طلب جديد من موقع الشركة المتحدة ANA*\n\n` +
                        `*الاسم:* ${formData.name}\n` +
                        `*البريد الإلكتروني:* ${formData.email}\n` +
                        `*رقم الهاتف:* ${formData.phone || 'غير متوفر'}\n` +
                        `*الخدمة:* ${serviceText}\n` +
                        `*الرسالة:*\n${formData.message}`;
                } else {
                    whatsappMessage = `🔔 *New Contact Form Submission*\n\n` +
                        `*Name:* ${formData.name}\n` +
                        `*Email:* ${formData.email}\n` +
                        `*Phone:* ${formData.phone || 'Not provided'}\n` +
                        `*Service:* ${serviceText}\n` +
                        `*Message:*\n${formData.message}`;
                }
                
                // WhatsApp Business number (without +)
                const whatsappNumber = '201117863705';
                
                // Encode message for URL
                const encodedMessage = encodeURIComponent(whatsappMessage);
                
                // Create WhatsApp link
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                
                // Try to open WhatsApp - handle popup blockers
                const whatsappWindow = window.open(whatsappUrl, '_blank');
                
                // Check if popup was blocked
                if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
                    // Popup blocked, try direct navigation
                    window.location.href = whatsappUrl;
                }
                
                // Show success message
                showFormMessage(getMessage('success'), 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Error preparing WhatsApp message:', error);
                console.error('Error details:', error.message, error.stack);
                showFormMessage(getMessage('error'), 'error');
            } finally {
                // Re-enable submit button
                setTimeout(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }
                }, 1000);
            }
        });
    }
    
    function showFormMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        
        // Style the message
        messageElement.style.padding = '15px';
        messageElement.style.marginTop = '20px';
        messageElement.style.borderRadius = '4px';
        messageElement.style.textAlign = 'center';
        messageElement.style.fontWeight = '500';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #c3e6cb';
        } else {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
        }
        
        // Insert after the form
        if (contactForm && contactForm.parentNode) {
            contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
        }
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
});