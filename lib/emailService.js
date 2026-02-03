import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration
 * You should get these from your EmailJS dashboard:
 * https://dashboard.emailjs.com/
 */
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_id_placeholder';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'public_key_placeholder';

// Templates
const TEMPLATE_ADMIN_NEW_ORDER = 'template_lzxfsii';
const TEMPLATE_USER_STATUS_UPDATE = 'template_fb07yfv';
const TEMPLATE_CONTACT_FORM = 'template_contact_form'; // Placeholder - User needs to create this

/**
 * Sends an email notification using EmailJS
 * @param {string} templateId - The EmailJS template ID
 * @param {Object} templateParams - The variables for the email template
 */
export const sendNotificationEmail = async (templateId, templateParams) => {
    try {
        const response = await emailjs.send(
            'service_q7bw4id', // New Service ID (dugunvideoedit@gmail.com)
            templateId,
            templateParams,
            'YrmwUDhneg7AZEYxU' // Hardcoded Public Key
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
    USER_STATUS_UPDATE: TEMPLATE_USER_STATUS_UPDATE,
    CONTACT_FORM: TEMPLATE_CONTACT_FORM
};
