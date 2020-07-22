import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'Graphql type for queries',
    // TODO correct types
    fields: () => ({
        helloWorld: {
            type: GraphQLString,
            resolve: (value, args, {me}) => {
                return 'Hello World!';
            }
        }
    })
});

export default QueryType;