import { GraphQLObjectType, GraphQLString } from "graphql";

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'Type query for all queries',
    fields: () => ({
        helloWorld: {
            type: GraphQLString,
            resolve: () => 'hello world'
        }
    }),
});

export default QueryType;
