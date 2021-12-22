import { QueryResolvers } from '@sprice237/accounting-gql';

export type AppResolversMap = {
  Query: Required<QueryResolvers>;
};

export const resolvers: AppResolversMap = {
  Query: {
    async accounts() {
      return [
        {
          id: '00000000-0000-0000-0000-000000000000',
          name: 'Account 1',
        },
      ];
    },
  },
};
