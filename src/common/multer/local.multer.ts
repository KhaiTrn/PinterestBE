import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
// tạo file nếu chưa có
fs.mkdirSync('upload/', { recursive: true });
const store = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const filenameString = `local-${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, filenameString);
  },
});
const uploadLocal = {
  storage: store,
  limits: { fileSize: 1 * 1024 * 1024 },
};
export default uploadLocal;
