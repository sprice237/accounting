import { parse } from 'csv';
import { createReadStream } from 'fs';
import Big from 'big.js';

import {
  AccountsRepository,
  TransactionItem,
  TransactionItemsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

export class CitiCsvRecordImporter {
  private uow = new UnitOfWork();

  constructor(private readonly filePath: string, private readonly accountId: string) {}

  async run(): Promise<void> {
    const account = await this.uow.getRepo(AccountsRepository).getById(this.accountId);

    if (!account) {
      throw new Error('account not found');
    }

    if (account.type !== 'LIABILITY') {
      throw new Error('only liability accounts are supported');
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
      headerRow[0]?.trim() !== 'Status' ||
      headerRow[1]?.trim() !== 'Date' ||
      headerRow[2]?.trim() !== 'Description' ||
      headerRow[3]?.trim() !== 'Debit' ||
      headerRow[4]?.trim() !== 'Credit'
    ) {
      throw new Error('invalid csv format');
    }

    for (const [dataRowIndex, dataRow] of data.entries()) {
      if (dataRow.length !== 5) {
        throw new Error(`invalid data encountered at row ${dataRowIndex + 2}`);
      }

      const [, dateStr, description, debitStr, creditStr] = dataRow as [
        string,
        string,
        string,
        string,
        string
      ];

      const [month, day, year] = dateStr.split('/');
      const dateTimeStr = `${year}-${month}-${day}T12:00:00Z`;
      const date = new Date(dateTimeStr);

      // in the CSV, purchases are debits and are positive, and applied payments are credits and are negative
      // we need purchases to correspond to credits and therefore be positive
      // we need applied payments to correspond to debits and therefore be negative
      // the CSV's debit and credit columns are labelled backwards, but because the numbers are the right
      // sign we can ignore the label and just add them together
      const amount = Big(creditStr || '0').add(Big(debitStr || '0'));

      const transactionItemCreateInput: Omit<TransactionItem, 'id'> = {
        accountId: this.accountId,
        transactionId: null,
        date,
        amount,
        description,
      };

      await this.uow.getRepo(TransactionItemsRepository).create(transactionItemCreateInput);
    }
  }
}
