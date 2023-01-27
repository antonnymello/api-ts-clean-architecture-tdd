import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  AddAccount,
} from './signup-protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';

class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const hasInvalidFields = this.validateReceivedFields(httpRequest);

      if (hasInvalidFields) return hasInvalidFields;

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'));

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) return badRequest(new InvalidParamError('email'));

      const account = await this.addAccount.add({ name, email, password });

      return { statusCode: 200, body: account };
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}

export default SignUpController;
