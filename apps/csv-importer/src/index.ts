import { Command } from 'commander';
import { AllyCsvRecordImporter } from './AllyCsvRecordImporter';
import { CitiCsvRecordImporter } from './CitiCsvRecordImporter';

async function main() {
  const program = new Command();
  program.requiredOption('-a --account <accountId>', 'account to import to');
  program.requiredOption('-f, --file <file>', 'file path to import');
  program.requiredOption('-i --importer <ally | citi>', 'importer to use');

  program.parse(process.argv);
  const options = program.opts();

  const filePath = options['file'];
  const accountId = options['account'];
  const importerType = options['importer'];

  if (typeof filePath !== 'string' || typeof accountId !== 'string') {
    throw new Error('incorrect file or account');
  }

  if (importerType !== 'ally' && importerType !== 'citi') {
    throw new Error(`invalid importer ${importerType}`);
  }

  if (importerType === 'ally') {
    const importer = new AllyCsvRecordImporter(filePath, accountId);
    await importer.run();
  } else if (importerType === 'citi') {
    const importer = new CitiCsvRecordImporter(filePath, accountId);
    await importer.run();
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(-1);
  }
);
