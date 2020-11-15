import {
  PipeTransform,
  ArgumentMetadata,
  NotImplementedException,
} from '@nestjs/common';
import * as Joi from '@hapi/joi';
import * as Joiful from 'joiful';
import { Constructor } from 'joiful/core';
import { MessageCodeError } from '../errors';

const options = {
  abortEarly: false, allowUnknown: true, stripUnknown: true, skipFunctions: true, convert: true,
};

export class ValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {
  }

  validateAsSchema(value: any) {
    const { error, value: validated } = Array.isArray(value)
      ? Joi.array().items().validate(value)
      : this.schema.validate(value, options);
    if (error) throw new MessageCodeError('validation:error', error.message);
    return validated;
  }

  private validateAsClass(value: any, metadata: ArgumentMetadata): any {
    const { error, value: validated } = Array.isArray(value)
      ? Joiful.validateArrayAsClass(value, metadata.metatype as Constructor<any>, options)
      : Joiful.validateAsClass(value, metadata.metatype as Constructor<any>, options);
    if (error) throw new MessageCodeError('validation:error', error.message);
    return validated;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    let validated: any;
    if (!metadata?.metatype && !this.schema) throw new NotImplementedException('Missing validation schema');
    if (this.schema) validated = this.validateAsSchema(value);
    else validated = this.validateAsClass(value, metadata);
    return validated;
  }
}
