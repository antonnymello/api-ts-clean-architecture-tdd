import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

interface MongoAccountModel extends AccountModel {
  _id: string;
}
export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    const { insertedId } = result;

    const account = await accountCollection.findOne<MongoAccountModel>({
      _id: insertedId,
    });

    return MongoHelper.map(account);
  }
}
