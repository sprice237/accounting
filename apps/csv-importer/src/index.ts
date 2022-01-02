import { Command } from 'commander';
import { CsvRecordImporter } from './csvRecordImporter';

async function main() {
  const program = new Command();
  program.requiredOption('-a --account <accountId>', 'account to import to');
  program.requiredOption('-f, --file <file>', 'file path to import');

  program.parse(process.argv);
  const options = program.opts();

  const filePath = options['file'];
  const accountId = options['account'];

  if (typeof filePath !== 'string' || typeof accountId !== 'string') {
    throw new Error('incorrect file or account');
  }

  const importer = new CsvRecordImporter(filePath, accountId);
  await importer.run();
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(-1);
  }
);
