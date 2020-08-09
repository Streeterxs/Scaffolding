import { GraphQLObjectType } from "graphql";

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'Type query for all queries',
    fields: () => ({}),
});

export default QueryType;
