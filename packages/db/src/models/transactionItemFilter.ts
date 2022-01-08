import { Model, ModelObject, RelationMappingsThunk } from 'objection';
import { AccountFilter, AccountFilterModel } from './accountFilter';
import { AmountFilter, AmountFilterModel } from './amountFilter';
import { DateFilter, DateFilterModel } from './dateFilter';
import { DescriptionFilter, DescriptionFilterModel } from './descriptionFilter';
import { RelativeTimeSpanFilter, RelativeTimeSpanFilterModel } from './relativeTimeSpanFilter';
import {
  TransactionItemTypeFilter,
  TransactionItemTypeFilterModel,
} from './transactionItemTypeFilter';

export class TransactionItemFilterModel extends Model {
  static override tableName = 'transactionItemFilters';

  static override get relationMappings(): RelationMappingsThunk {
    return () => ({
      amountFilters: {
        relation: Model.HasManyRelation,
        modelClass: AmountFilterModel,
        join: {
          from: `${TransactionItemFilterModel.tableName}.id`,
          to: `${AmountFilterModel.tableName}.transactionItemFilterId`,
        },
      },
      accountFilters: {
        relation: Model.HasManyRelation,
        modelClass: AccountFilterModel,
        join: {
          from: `${TransactionItemFilterModel.tableName}.id`,
          to: `${AccountFilterModel.tableName}.transactionItemFilterId`,
        },
      },
      dateFilters: {
        relation: Model.HasManyRelation,
        modelClass: DateFilterModel,
        join: {
          from: `${TransactionItemFilterModel.tableName}.id`,
          to: `${DateFilterModel.tableName}.transactionItemFilterId`,
        },
      },
      descriptionFilters: {
        relation: Model.HasManyRelation,
        modelClass: DescriptionFilterModel,
        join: {
          from: `${TransactionItemFilterModel.tableName}.id`,
          to: `${DescriptionFilterModel.tableName}.transactionItemFilterId`,
        },
      },
      relativeTimeSpanFilters: {
        relation: Model.HasManyRelation,
        modelClass: RelativeTimeSpanFilterModel,
        join: {
          from: `${TransactionItemFilterModel.tableName}.id`,
          to: `${RelativeTimeSpanFilterModel.tableName}.transactionItemFilterId`,
        },
      },
      transactionItemTypeFilters: {
        relation: Model.HasManyRelation,
        modelClass: TransactionItemTypeFilterModel,
        join: {
          from: `${TransactionItemFilterModel.tableName}.id`,
          to: `${TransactionItemTypeFilterModel.tableName}.transactionItemFilterId`,
        },
      },
    });
  }

  id!: string;
}

export type TransactionItemFilter = ModelObject<TransactionItemFilterModel>;

export type TransactionItemFilterRelations = {
  amountFilters: AmountFilter[];
  accountFilters: AccountFilter[];
  dateFilters: DateFilter[];
  descriptionFilters: DescriptionFilter[];
  relativeTimeSpanFilters: RelativeTimeSpanFilter[];
  transactionItemTypeFilters: TransactionItemTypeFilter[];
};
