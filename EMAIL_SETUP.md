# Email Setup Guide for Tour Explorer

To send real booking confirmation/cancellation emails, follow these steps:

## Step 1: Create EmailJS Account (Free)

1. Go to https://www.emailjs.com/
2. Click "Sign Up Free"
3. Create an account (free tier allows 200 emails/month)

## Step 2: Add Email Service

1. Go to "Email Services" in dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended):
   - Select "Gmail"
   - Click "Connect Account"
   - Authorize with your Gmail
4. Note your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:**
```
Tour Explorer - Booking {{status}} - {{tour_name}}
```

**Content:**
```html
Hello {{to_name}},

{{status_message}}

📋 Booking Details:
━━━━━━━━━━━━━━━━━━━━
🎫 Booking ID: #{{booking_id}}
🌍 Tour: {{tour_name}}
📅 Date: {{booking_date}}
👥 Guests: {{guests}}
💰 Total: {{total_price}}
📊 Status: {{status}}

Thank you for choosing Tour Explorer!

Best regards,
Tour Explorer Team
✈️ www.tourexplorer.com
```

4. Save and note your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to "Account" → "General"
2. Copy your **Public Key**

## Step 5: Update Your Code

Open `src/services/api.js` and update these values (around line 290):

```javascript
const EMAILJS_SERVICE_ID = 'service_abc123';     // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789';   // Your Template ID  
const EMAILJS_PUBLIC_KEY = 'your_public_key';    // Your Public Key
```

## Step 6: Test

1. Login as admin (admin@tourexplorer.com / admin123)
2. Go to Bookings Management
3. Approve or Cancel a booking
4. Check the user's email!

## Troubleshooting

- **Emails not sending?** Check browser console for errors
- **Gmail blocking?** Enable "Less secure apps" or use App Password
- **Quota exceeded?** Free tier is 200 emails/month

## Alternative: Use Backend Email

If you have the backend running with MongoDB, you can also set up email via the backend using Nodemailer. See `backend/README.md` for details.
