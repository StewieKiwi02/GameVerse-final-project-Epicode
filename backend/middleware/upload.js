const multer = require('multer');

// Configuriamo multer per tenere il file in memoria (buffer)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
