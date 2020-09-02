import { errorMessagesConfig } from '..';
import { IErrorMessages } from '../config/interfaces/error-message.interface';

export class MessageCodeError extends Error {
    public messageCode: string;
    public httpStatus: number;
    public errorMessage: string;

    constructor(messageCode: string, errorBody?: string) {
      super();

      const errorMessageConfig = this.getMessageFromMessageCode(messageCode, errorBody);
      if (!errorMessageConfig) throw new Error('Unable to find message code error.');

      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.httpStatus = errorMessageConfig.httpStatus;
      this.messageCode = messageCode;
      this.errorMessage = errorMessageConfig.errorMessage;
      this.message = errorMessageConfig.userMessage;
    }

    /**
     * @description: Find the error config by the given message code.
     * @param {string} messageCode
     * @param {string | undefined} customBody
     * @return {IErrorMessages}
     */
    private getMessageFromMessageCode(messageCode: string, customBody?: string): IErrorMessages {
      let errorMessageConfig: IErrorMessages | undefined;
      Object.keys(errorMessagesConfig).some((key) => {
        if (key === messageCode) {
          errorMessageConfig = errorMessagesConfig[key];
          if (customBody) errorMessageConfig.userMessage += customBody;
          return true;
        }
        return false;
      });

      if (!errorMessageConfig) throw new Error('Unable to find the given message code error.');
      return errorMessageConfig;
    }
}
