import { Model, RelationMappingsThunk } from 'objection';
import {
  AutomaticActionSourceFilter,
  AutomaticActionSourceFilterModel,
} from './automaticActionSourceFilter';
import { AutomaticActionNewTransactionAccountModel } from './automaticActionNewTransactionAccount';
import { BaseModelWithTimestamps, ModelObjectWithoutTimestamps } from './baseModelWithTimestamps';
import { Account, AccountModel } from './account';
import {
  AutomaticActionExistingTransactionFilter,
  AutomaticActionExistingTransactionFilterModel,
} from './automaticActionExistingTransactionFilter';
import { TransactionItemFilter, TransactionItemFilterRelations } from './transactionItemFilter';

export type AutomaticActionType = 'CREATE_NEW_TRANSACTION' | 'LINK_EXISTING_TRANSACTION_ITEM';

export class AutomaticActionModel extends BaseModelWithTimestamps {
  static override tableName = 'automaticActions';

  static override get relationMappings(): RelationMappingsThunk {
    return () => ({
      sourceFilters: {
        relation: Model.HasManyRelation,
        modelClass: AutomaticActionSourceFilterModel,
        join: {
          from: `${AutomaticActionModel.tableName}.id`,
          to: `${AutomaticActionSourceFilterModel.tableName}.automaticActionId`,
        },
      },
      newTransactionAccount: {
        relation: Model.HasOneThroughRelation,
        modelClass: AccountModel,
        join: {
          from: `${AutomaticActionModel.tableName}.id`,
          through: {
            modelClass: AutomaticActionNewTransactionAccountModel,
            from: `${AutomaticActionNewTransactionAccountModel.tableName}.automaticActionId`,
            to: `${AutomaticActionNewTransactionAccountModel.tableName}.accountId`,
          },
          to: `${AccountModel.tableName}.id`,
        },
      },
      existingTransactionFilters: {
        relation: Model.HasManyRelation,
        modelClass: AutomaticActionExistingTransactionFilterModel,
        join: {
          from: `${AutomaticActionModel.tableName}.id`,
          to: `${AutomaticActionExistingTransactionFilterModel.tableName}.automaticActionId`,
        },
      },
    });
  }

  id!: string;
  portfolioId!: string;
  orderIndex!: number;
  type!: AutomaticActionType;
}

export type AutomaticAction = ModelObjectWithoutTimestamps<AutomaticActionModel>;

export type AutomaticActionRelations = {
  sourceFilters: AutomaticActionSourceFilter[];
  newTransactionAccount: Account;
  existingTransactionFilters: AutomaticActionExistingTransactionFilter[];
};

export type AutomaticActionDeep = AutomaticAction & {
  sourceFilters: (AutomaticActionSourceFilter & {
    transactionItemFilter: TransactionItemFilter & TransactionItemFilterRelations;
  })[];
  newTransactionAccount: Account;
  existingTransactionFilters: (AutomaticActionExistingTransactionFilter & {
    transactionItemFilter: TransactionItemFilter & TransactionItemFilterRelations;
  })[];
};
