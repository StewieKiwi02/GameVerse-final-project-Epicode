
const cloudinary = require('../config/cloudinary');


function uploadBufferToCloudinary(buffer, folder = 'uploads') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

module.exports = uploadBufferToCloudinary;