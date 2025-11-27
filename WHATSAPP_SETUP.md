# WhatsApp Business Integration Setup

This guide will help you set up WhatsApp Business notifications for your contact form.

## Option 1: Using ChatAPI (Recommended - Easy Setup)

1. Sign up at [ChatAPI.io](https://www.chat-api.com/) (free tier available)
2. Get your API key and instance ID from the dashboard
3. Add these environment variables in Netlify:
   - `WHATSAPP_API_URL` = `https://api.chat-api.com/instance{INSTANCE_ID}`
   - `WHATSAPP_API_KEY` = Your API key from ChatAPI
   - `WHATSAPP_PHONE_NUMBER` = Your WhatsApp Business number (e.g., 201234567890)

## Option 2: Using Twilio WhatsApp API

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get WhatsApp approved for your account
3. Add these environment variables in Netlify:
   - `TWILIO_ACCOUNT_SID` = Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN` = Your Twilio Auth Token
   - `WHATSAPP_PHONE_NUMBER` = Your WhatsApp Business number (format: whatsapp:+201234567890)
   - `WHATSAPP_API_URL` = `https://api.twilio.com`

## Option 3: Using Wati.io (WhatsApp Business API)

1. Sign up at [Wati.io](https://www.wati.io/)
2. Get your API token
3. Add these environment variables in Netlify:
   - `WHATSAPP_API_URL` = `https://api.wati.io/v1`
   - `WHATSAPP_API_KEY` = Your Wati API token
   - `WHATSAPP_PHONE_NUMBER` = Your WhatsApp Business number
   - `WHATSAPP_INSTANCE_ID` = Your Wati instance ID

## How to Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each variable name and value
6. Redeploy your site

## Testing

After setting up, test the form on your website. You should receive WhatsApp messages whenever someone submits the contact form.

## Message Format

You'll receive messages in this format:
```
🔔 New Contact Form Submission

Name: [Name]
Email: [Email]
Phone: [Phone]
Service: [Service]
Message:
[Message]

Submitted from United Company Website
```

