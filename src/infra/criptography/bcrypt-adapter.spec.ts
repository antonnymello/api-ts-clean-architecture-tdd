import bcrypt from 'bcrypt';
import BcryptAdapter from './bcrypt-adapter';

interface SutTypes {
  sut: BcryptAdapter;
  salt: number;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);

  return { salt, sut };
};

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct data', async () => {
    const { sut, salt } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('valid_password');

    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt);
  });
});
