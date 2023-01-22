import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../protocols';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';

class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  validateReceivedFields(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const field of requiredFields) {
      if (httpRequest.body[field]) continue;

      return badRequest(new MissingParamError(field));
    }
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const hasInvalidFields = this.validateReceivedFields(httpRequest);

      if (hasInvalidFields) return hasInvalidFields;

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'));

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isEmailValid) return badRequest(new InvalidParamError('email'));
    } catch (error) {
      return serverError();
    }
  }
}

export default SignUpController;
