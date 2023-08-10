import { Request } from 'express';

export default interface IRequestWithRawBody extends Request {
  rawBody: Buffer;
}
