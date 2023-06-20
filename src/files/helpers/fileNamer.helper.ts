import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

/* eslint-disable @typescript-eslint/ban-types */
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file)
    return callback(
      new BadRequestException('Debe introducir un archivo'),
      false,
    );

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
