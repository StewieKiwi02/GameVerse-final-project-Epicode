const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/send', async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail({ to, subject, text, html });
    res.status(200).json({ message: 'Email inviata' });
  } catch (error) {
    res.status(500).json({ message: 'Errore invio email', error: error.message });
  }
});

module.exports = router;
