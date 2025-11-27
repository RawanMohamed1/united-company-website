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
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim()
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
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.textContent;
                submitButton.textContent = getMessage('sending');
                
                try {
                    // Submit to Netlify function
                    const response = await fetch('/.netlify/functions/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok && result.success) {
                        showFormMessage(getMessage('success'), 'success');
                        contactForm.reset();
                    } else {
                        showFormMessage(result.error || getMessage('error'), 'error');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    showFormMessage(getMessage('error'), 'error');
                } finally {
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
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