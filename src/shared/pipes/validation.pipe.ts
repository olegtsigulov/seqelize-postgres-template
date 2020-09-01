import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as Joiful from 'joiful';
import { Constructor } from 'joiful/core';

export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const resValue = this.validateAsClass(value, metadata);
    return resValue;
  }

  private validateAsClass(value: any, metadata: ArgumentMetadata) {
    const { error, value: resValue } = Array.isArray(value)
      ? Joiful.validateArrayAsClass(
        value,
                metadata.metatype as Constructor<any>,
      )
      : Joiful.validateAsClass(value, metadata.metatype as Constructor<any>);
    if (error) throw new BadRequestException(`Validation failed! ${error}`);
    return resValue;
  }
}
