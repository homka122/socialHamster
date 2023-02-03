import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/avatars');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, req.user.username + '-avatar' + '.jpg');
  },
});

export const uploadAvatar = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new ApiError('Разрешены только изображения'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});
