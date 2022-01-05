import { ModelObject } from 'objection';
import { AccountRelationshipModel } from '$models';
import { BaseRepositoryWithDefaultActions } from './baseRepositoryWithDefaultActions';

export class AccountRelationshipsRepository extends BaseRepositoryWithDefaultActions<
  AccountRelationshipModel,
  'accountId',
  Omit<ModelObject<AccountRelationshipModel>, 'createdAt' | 'updatedAt'>
> {
  get ModelClass(): typeof AccountRelationshipModel {
    return AccountRelationshipModel;
  }
}
