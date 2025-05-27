const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@gameverse.com',
    subject,
    text,
    html,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('💌 EMAIL SIMULATA (non inviata):');
    console.log(msg);
    return;
  }

  try {
    await sgMail.send(msg);
    console.log('✅ Email inviata con successo a', to);
  } catch (error) {
    console.error('❌ Errore invio email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

module.exports = sendEmail;
