import multer from "multer";
import path from "path";
import { v4 } from "uuid";
import * as fse from "fs-extra";
import { HttpError } from "../helpers/HttpError.js";

export class ImageService {
    static initUploadImageMiddleware (fieldName) {
        const multerStorage = multer.memoryStorage();

        const multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith('avatars/')) {
            cb(null, true);
            } else {
              cb(new HttpError(400, 'Please upload images only'), false);
            }
          };
          return multer({
            storage: multerStorage,
            fileFilter: multerFilter,
          }).single(fieldName);    
        }
        //'avatars', 'users', '<userId></userId>',
        static async saveImage(file, options, ...pathSegments) {
            if (file.size > (options?.maxFilesSize ? options.maxFilesSize
                 *1024 *1024 : 1 * 1024 *1024)) {
                throw new HttpError(400, 'File is to large');
            }
            const fileName = `${v4()}.jpeg`;
            const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

            await fse.ensureDir(fullFilePath);
            //jimp to be replaced
            await sharp(file.buffer)
            .resize({ height: options?.height ?? 300, width: options?.with ?? 300 })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(fullFilePath, fileName));
            return path.join(...pathSegments, fileName) ; 

        }
    }