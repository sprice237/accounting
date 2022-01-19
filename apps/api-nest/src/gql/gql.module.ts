import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { schemaLoader } from '@sprice237/accounting-gql';
import { MoneyScalar } from './moneyScalar';
import { DateScalar } from './dateScalar';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      // imports: [DatabaseModule],
      // inject: [DatabaseService],
      // useFactory: async (databaseService: DatabaseService) => {
      useFactory: async () => {
        const typeDefs = await schemaLoader();
        return {
          typeDefs,
          // async context({ req }: { req: Request }) {
          //   const portfolioId = req.headers['x-portfolio-id'];
          
          //   const uow = databaseService.createUnitOfWork();
          
          //   const portfolio =
          //     portfolioId && !Array.isArray(portfolioId)
          //       ? await uow.getRepo(PortfoliosRepository).getById(portfolioId)
          //       : undefined;
          
          //   const assertPortfolio = (): Portfolio => {
          //     if (!portfolio) {
          //       throw new ForbiddenError('Portfolio not available');
          //     }
          
          //     return portfolio;
          //   };
          
          //   return {
          //     portfolio,
          //     assertPortfolio,
          //   };
          // }
        }
      }
    })
  ],
  providers: [DateScalar, MoneyScalar]
})
export class GqlModule {}
