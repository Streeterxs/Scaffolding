import { GraphQLObjectType } from 'graphql';

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Mutation types',
    // TODO correct types
    fields: {
    }
});

export default MutationType;
