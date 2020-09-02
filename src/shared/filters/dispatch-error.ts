import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,
} from '@nestjs/common';
import { ValidationError, DatabaseError } from 'sequelize';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MessageCodeError } from '../errors';

@Catch(MessageCodeError, ValidationError, HttpException, Error)
export class DispatchError implements ExceptionFilter {
  public catch(err: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    if (err instanceof MessageCodeError) {
      /** MessageCodeError, Set all header variable to
       * have a context for the client in case of MessageCodeError. */
      res.setHeader('x-message-code-error', err.messageCode);
      res.setHeader('x-message', err.message);
      res.setHeader('x-httpStatus-error', err.httpStatus);

      return res.status(err.httpStatus).send();
    } if (err instanceof ValidationError || err instanceof DatabaseError) {
      /** Sequelize validation error. */
      res.setHeader('x-message-code-error', (err as ValidationError).errors[0].type);
      res.setHeader('x-message', (err as ValidationError).errors[0].message);
      res.setHeader('x-httpStatus-error', HttpStatus.BAD_REQUEST);

      return res.status(HttpStatus.BAD_REQUEST).send();
    } if (err instanceof JsonWebTokenError) {
      res.setHeader('x-message', 'Unauthorized');
      res.setHeader('x-httpStatus-error', HttpStatus.UNAUTHORIZED);
      return res.status(HttpStatus.UNAUTHORIZED).send();
    }

    return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.response || err.message });
  }
}
