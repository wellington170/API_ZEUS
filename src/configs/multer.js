const multer = require('multer');

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const storage = multer.memoryStorage();  

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos JPG, JPEG e PNG são permitidos.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});

function verificaErroMulter(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    let message = '';

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'Arquivo deve ter no máximo 2MB.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Apenas arquivos JPG, JPEG e PNG são permitidos.';
        break;
      default:
        message = err.message;
    }
    return res.status(400).json({ error: message });
  } else if (err) return res.status(400).json({ error: err.message });
  
  next();
}

module.exports = { upload, verificaErroMulter };