// Netlify function to handle contact form submissions and send to WhatsApp Business
const axios = require('axios');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
    
    try {
        const data = JSON.parse(event.body);
        
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }
        
        // Get WhatsApp configuration from environment variables
        const whatsappApiUrl = process.env.WHATSAPP_API_URL;
        const whatsappApiKey = process.env.WHATSAPP_API_KEY;
        const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER; // Your WhatsApp Business number (e.g., 201234567890)
        const whatsappInstanceId = process.env.WHATSAPP_INSTANCE_ID;
        
        // Format the message for WhatsApp
        const serviceNames = {
            'kitchen': 'Kitchen Equipment',
            'tanks': 'Tanks & Reservoirs',
            'piping': 'Piping Systems',
            'welding': 'Welding Services',
            'industrial': 'Industrial Supplies',
            'structures': 'Steel Structures'
        };
        
        const serviceText = data.service ? serviceNames[data.service] || data.service : 'Not specified';
        
        const whatsappMessage = `🔔 *New Contact Form Submission*\n\n` +
            `*Name:* ${data.name}\n` +
            `*Email:* ${data.email}\n` +
            `*Phone:* ${data.phone || 'Not provided'}\n` +
            `*Service:* ${serviceText}\n` +
            `*Message:*\n${data.message}\n\n` +
            `_Submitted from United Company Website_`;
        
        // Send to WhatsApp Business API
        let whatsappSent = false;
        
        if (whatsappApiUrl && whatsappApiKey && whatsappPhoneNumber) {
            try {
                // Option 1: Using ChatAPI or similar service
                if (whatsappApiUrl.includes('chat-api.com') || whatsappApiUrl.includes('api.chat-api.com')) {
                    const response = await axios.post(
                        `${whatsappApiUrl}/sendMessage`,
                        {
                            phone: whatsappPhoneNumber,
                            body: whatsappMessage
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${whatsappApiKey}`
                            }
                        }
                    );
                    
                    if (response.data && response.data.sent) {
                        whatsappSent = true;
                    }
                }
                // Option 2: Using Twilio WhatsApp API
                else if (whatsappApiUrl.includes('twilio.com') || whatsappInstanceId) {
                    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || whatsappApiKey;
                    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || whatsappApiKey;
                    const fromNumber = `whatsapp:${whatsappPhoneNumber}`;
                    const toNumber = `whatsapp:${whatsappPhoneNumber}`;
                    
                    const response = await axios.post(
                        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
                        new URLSearchParams({
                            From: fromNumber,
                            To: toNumber,
                            Body: whatsappMessage
                        }),
                        {
                            auth: {
                                username: twilioAccountSid,
                                password: twilioAuthToken
                            }
                        }
                    );
                    
                    if (response.data && response.data.sid) {
                        whatsappSent = true;
                    }
                }
                // Option 3: Using generic WhatsApp Business API (like Evolution API, Wati, etc.)
                else {
                    const response = await axios.post(
                        whatsappApiUrl,
                        {
                            phone: whatsappPhoneNumber,
                            message: whatsappMessage,
                            instanceId: whatsappInstanceId
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${whatsappApiKey}`,
                                'apikey': whatsappApiKey
                            }
                        }
                    );
                    
                    if (response.status === 200 || response.status === 201) {
                        whatsappSent = true;
                    }
                }
                
                console.log('WhatsApp message sent successfully');
            } catch (whatsappError) {
                console.error('Error sending WhatsApp message:', whatsappError.response?.data || whatsappError.message);
                // Continue even if WhatsApp fails - still return success to user
            }
        } else {
            console.log('WhatsApp configuration not set. Please configure environment variables.');
            console.log('Form submission data:', data);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Thank you for your message! We will get back to you soon.',
                success: true,
                whatsappSent: whatsappSent
            })
        };
        
    } catch (error) {
        console.error('Error processing form:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};