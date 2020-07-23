import { GraphQLObjectType } from 'graphql';

import AuthorMutations from '../modules/author/mutations';
import BookMutations from '../modules/book/mutations';

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Mutation types',
    // TODO correct types
    fields: {
        ...AuthorMutations,
        ...BookMutations
    }
});

export default MutationType;
