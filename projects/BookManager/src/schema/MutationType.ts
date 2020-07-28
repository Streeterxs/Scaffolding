import { GraphQLObjectType } from 'graphql';

import AuthorMutations from '../modules/author/mutations';
import BookMutations from '../modules/book/mutations';
import CategoryMutations from '../modules/category/mutations';
import EditionCreation from '../modules/edition/mutations';

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Mutation types',
    // TODO correct types
    fields: {
        ...AuthorMutations,
        ...BookMutations,
        ...CategoryMutations,
        ...EditionCreation
    }
});

export default MutationType;
