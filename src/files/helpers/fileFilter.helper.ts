import { BadRequestException } from '@nestjs/common';

/* eslint-disable @typescript-eslint/ban-types */
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = file.mimetype.split('/')[1];

  if (validExtension.includes(fileExtension)) return callback(null, true);

  return callback(
    new BadRequestException('Debe introducir un archivo válido'),
    false,
  );
};
