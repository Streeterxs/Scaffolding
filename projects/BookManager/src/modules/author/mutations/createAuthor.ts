import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import AuthorType from '../AuthorType';
import { loadAuthor } from '../AuthorLoader';
import Author from '../AuthorModel';

const AuthorCreation = mutationWithClientMutationId({
    name: 'AuthorCreation',
    description: 'Author Creation',
    inputFields: {
        name: {
            type: GraphQLString
        }
    },
    outputFields: {
        author: {
            type: AuthorType,
            resolve: (authorId: string) => loadAuthor(authorId)
        }
    },
    mutateAndGetPayload: async ({name}) => {
        try {

            const AuthorCreated = new Author({name});
            await AuthorCreated.save();

            return AuthorCreated.id;
        } catch (err) {

            console.log(err);
        }
    }
});

export default AuthorCreation;
