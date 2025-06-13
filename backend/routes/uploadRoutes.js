const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configura Cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Funzione per caricare il file su Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'gameverse' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nessun file caricato' });

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      message: 'Upload effettuato con successo',
    });
  } catch (error) {
    console.error('Errore upload Cloudinary:', error);
    res.status(500).json({ message: 'Errore durante l\'upload del file' });
  }
});

module.exports = router;
