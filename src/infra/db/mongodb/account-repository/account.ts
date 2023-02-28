import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    const { insertedId } = result;

    const account = await accountCollection.findOne({ _id: insertedId });

    const { _id, ...accountWithoutMongoId } = account;

    return Object.assign({}, accountWithoutMongoId, {
      id: _id,
    }) as unknown as AccountModel;
  }
}
