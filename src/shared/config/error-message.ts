import { HttpStatus } from '@nestjs/common';
import { IErrorMessages } from './interfaces/error-message.interface';

export const errorMessagesConfig: { [messageCode: string]: IErrorMessages } = {
  'user:banned': {
    type: 'BadRequest',
    httpStatus: HttpStatus.FORBIDDEN,
    errorMessage: 'User in black list',
    userMessage: 'Sorry, you have been banned by administrator',
  },
  'user:notFound': {
    type: 'notFound',
    httpStatus: HttpStatus.NOT_FOUND,
    errorMessage: 'Unable to found the user with the provided information.',
    userMessage: 'User not found',
  },
  'request:unauthorized': {
    type: 'unauthorized',
    httpStatus: HttpStatus.UNAUTHORIZED,
    errorMessage: 'Access unauthorized.',
    userMessage: 'Token missing or not valid',
  },
  'auth:login:missingCredentials': {
    type: 'BadRequest',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Unable to connect the user without email or password',
    userMessage: 'Missing email or password',
  },
  'auth:login:invalidCredentials': {
    type: 'BadRequest',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Unable to connect the user, wrong email or password',
    userMessage: 'Wrong email or password',
  },
  'validation:error': {
    type: 'ValidationError',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Validation error',
    userMessage: 'Validation error: ',
  },
};
