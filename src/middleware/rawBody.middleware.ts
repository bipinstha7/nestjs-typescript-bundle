import { json, Response } from 'express';
import IRequestWithRawBody from '../modules/stripe/webhook/requestWithRawBody.interface';

export default function rawBodyMiddleware() {
  return json({
    verify: (req: IRequestWithRawBody, res: Response, buffer: Buffer) => {
      if (req.url === '/webhook' && Buffer.isBuffer(buffer)) {
        req.rawBody = Buffer.from(buffer);
      }

      return true;
    },
  });
}
