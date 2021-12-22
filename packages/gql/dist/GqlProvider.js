"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("@apollo/client");
const apollo_upload_client_1 = require("apollo-upload-client");
const context_1 = require("@apollo/client/link/context");
const buildLink = (uri, token, organizationId) => client_1.ApolloLink.concat(context_1.setContext((_, prevContext) => (Object.assign(Object.assign({}, prevContext), { headers: Object.assign(Object.assign(Object.assign({}, prevContext.headers), (token ? { authorization: `Bearer ${token}` } : {})), (organizationId ? { 'x-organization-id': organizationId } : {})) }))), apollo_upload_client_1.createUploadLink({
    uri,
}));
exports.GqlProvider = react_1.memo(({ uri, token, organizationId, children }) => {
    const [client, setClient] = react_1.useState();
    // initialize `client`
    react_1.useEffect(() => {
        setClient(new client_1.ApolloClient({
            cache: new client_1.InMemoryCache(),
            link: buildLink(uri, token, organizationId),
        }));
    }, []);
    // update client link whenever uri, token, or organizationId changes
    react_1.useEffect(() => {
        if (!client) {
            return;
        }
        client.setLink(buildLink(uri, token, organizationId));
    }, [uri, token, organizationId]);
    if (!client) {
        return null;
    }
    return jsx_runtime_1.jsx(client_1.ApolloProvider, Object.assign({ client: client }, { children: children }), void 0);
});
