import { PortfoliosRepository, UnitOfWork } from '@sprice237/accounting-db';
import { AutomaticActionsHandler } from './AutomaticActionsHandler';

async function main() {
  const uow = new UnitOfWork();
  const portfolios = await uow.getRepo(PortfoliosRepository).getAll();

  for (const portfolio of portfolios) {
    const handler = new AutomaticActionsHandler(portfolio);
    await handler.run();
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(-1);
  }
);
