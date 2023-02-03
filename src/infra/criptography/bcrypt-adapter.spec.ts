import bcrypt from 'bcrypt';
import BcryptAdapter from './bcrypt-adapter';

interface SutTypes {
  sut: BcryptAdapter;
}

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => {
      resolve('hashed_password');
    });
  },
}));

const salt = 12;

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt);

  return { sut };
};

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct data', async () => {
    const { sut } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('valid_password');

    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt);
  });

  test('Should returns a hashed password on success', async () => {
    const { sut } = makeSut();

    const hashedPassword = await sut.encrypt('valid_password');

    expect(hashedPassword).toBe('hashed_password');
  });

  test('Should throw if bcrypt throws errors', async () => {
    const { sut } = makeSut();

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.encrypt('valid_password');

    await expect(promise).rejects.toThrow();
  });
});
