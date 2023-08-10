/* The Mongoose library that we use for connecting to MongoDB and fetching entities does not return instances of our User class. Therefore, the ClassSerializerInterceptor won’t work out of the box. Let’s change it a bit using the mixin pattern. */

import {
  Type,
  PlainLiteralObject,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Document } from 'mongoose';
import { ClassTransformOptions, plainToClass } from 'class-transformer';

export default function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }

      return plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
