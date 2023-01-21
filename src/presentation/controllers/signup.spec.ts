import SignUpController from './singup';

describe('SignUp Controller', () => {
  test('Should return 400 if name was not provided', () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: name'));
  });
});
