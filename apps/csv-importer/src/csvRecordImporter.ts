import { parse } from 'csv';
import { createReadStream } from 'fs';
import Big from 'big.js';

import {
  AccountsRepository,
  TransactionItem,
  TransactionItemsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

export class CsvRecordImporter {
  private uow = new UnitOfWork();

  constructor(private readonly filePath: string, private readonly accountId: string) {}

  async run(): Promise<void> {
    const account = await this.uow.getRepo(AccountsRepository).getById(this.accountId);

    if (!account) {
      throw new Error('account not found');
    }

    if (account.type !== 'ASSET') {
      throw new Error('only asset accounts are supported');
    }

    const stream = createReadStream(this.filePath);

    const parser = parse();
    stream.pipe(parser);

    const csvContents = await new Promise<string[][]>((resolve, reject) => {
      const rows: string[][] = [];

      parser.on('data', (row) => {
        rows.push(row);
      });

      parser.on('end', () => {
        resolve(rows);
      });

      stream.on('error', reject);
    });

    if (csvContents.length < 2) {
      throw new Error('no data found');
    }

    const [headerRow, ...data] = csvContents as [string[], ...string[][]];

    if (
      headerRow.length !== 5 ||
      headerRow[0]?.trim() !== 'Date' ||
      headerRow[1]?.trim() !== 'Time' ||
      headerRow[2]?.trim() !== 'Amount' ||
      headerRow[3]?.trim() !== 'Type' ||
      headerRow[4]?.trim() !== 'Description'
    ) {
      throw new Error('invalid csv format');
    }

    for (const [dataRowIndex, dataRow] of data.entries()) {
      if (dataRow.length !== 5) {
        throw new Error(`invalid data encountered at row ${dataRowIndex + 2}`);
      }

      const [dateStr, timeStr, amountStr, type, description] = dataRow as [
        string,
        string,
        string,
        string,
        string
      ];

      const dateTimeStr = `${dateStr}T${timeStr}Z`;
      const date = new Date(dateTimeStr);
      const transactionType = type === 'Withdrawal' ? 'CREDIT' : 'DEBIT';
      const amount = Big(amountStr).mul(type === 'Withdrawal' ? -1 : 1);

      const transactionItemCreateInput: Omit<TransactionItem, 'id'> = {
        accountId: this.accountId,
        transactionId: null,
        date,
        amount,
        type: transactionType,
        description,
      };

      await this.uow.getRepo(TransactionItemsRepository).create(transactionItemCreateInput);
    }
  }
}
