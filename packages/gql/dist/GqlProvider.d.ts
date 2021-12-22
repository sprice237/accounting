import { FC } from 'react';
export declare type GqlProviderProps = {
    uri: string;
    token?: string;
    organizationId?: string;
};
export declare const GqlProvider: FC<GqlProviderProps>;
