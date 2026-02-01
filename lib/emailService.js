import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration
 * You should get these from your EmailJS dashboard:
 * https://dashboard.emailjs.com/
 */
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_id_placeholder';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'public_key_placeholder';

// Templates
const TEMPLATE_ADMIN_NEW_ORDER = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE || 'template_new_order_placeholder';
const TEMPLATE_USER_STATUS_UPDATE = process.env.NEXT_PUBLIC_EMAILJS_USER_TEMPLATE || 'template_status_update_placeholder';

/**
 * Sends an email notification using EmailJS
 * @param {string} templateId - The EmailJS template ID
 * @param {Object} templateParams - The variables for the email template
 */
export const sendNotificationEmail = async (templateId, templateParams) => {
    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            templateId,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('Email sent successfully!', response.status, response.text);
        return { success: true, response };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
};

export const templates = {
    ADMIN_NEW_ORDER: TEMPLATE_ADMIN_NEW_ORDER,
    USER_STATUS_UPDATE: TEMPLATE_USER_STATUS_UPDATE
};
