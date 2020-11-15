import { get } from 'lodash';
import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,
} from '@nestjs/common';
import { ValidationError, DatabaseError } from 'sequelize';
import * as Sentry from '@sentry/minimal';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MessageCodeError } from '../errors';

@Catch(MessageCodeError, ValidationError, HttpException, Error)
export class DispatchError implements ExceptionFilter {
  public catch(err: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    if (err instanceof MessageCodeError) {
      /** MessageCodeError, Set all header variable to
       * have a context for the client in case of MessageCodeError. */
      return res.status(err.httpStatus).send(err);
    } if (err instanceof ValidationError || err instanceof DatabaseError) {
      /** Sequelize validation error. */
      Sentry.captureException(err);
      return res.status(HttpStatus.BAD_REQUEST).send(err);
    } if (err instanceof JsonWebTokenError) {
      return res.status(HttpStatus.UNAUTHORIZED).send(err);
    }
    Sentry.captureException(err);
    return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: get(err, 'message', 'Something went wrong') });
  }
}
