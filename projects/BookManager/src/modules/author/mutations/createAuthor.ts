import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import AuthorType from '../AuthorType';
import { loadAuthor } from '../AuthorLoader';
import Author from '../AuthorModel';

import { appLogger } from '../../../appLogger';
import { testsLogger } from '../../../tests/testsLogger';

let log;
if(process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:author:mutations:createAuthor');
} else {

    log = appLogger.extend('modules:author:mutations:createAuthor');
}

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
            resolve: async (authorIdObj) => {

                const authorCreated = await loadAuthor(authorIdObj.id);
                return authorCreated;
            }
        }
    },
    mutateAndGetPayload: async ({name}) => {
        try {
            const AuthorCreated = new Author({name});
            await AuthorCreated.save();

            return {id: AuthorCreated.id};
        } catch (err) {

            log('error: ', err);
        }
    }
});

export default AuthorCreation;
