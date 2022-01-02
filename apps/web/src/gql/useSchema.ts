import { useMemo } from 'react';
import { getSchema } from '@sprice237/accounting-gql';

export const useSchema = (gqlSchema: string): ReturnType<typeof getSchema> | null => {
  const schema = useMemo(() => {
    return getSchema(gqlSchema);
  }, [gqlSchema]);

  return schema;
};
