import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import AuthorType from '../AuthorType';
import { loadAuthor } from '../AuthorLoader';
import Author from '../AuthorModel';

import { appLogger } from '../../../appLogger';
import { testsLogger } from '../../../tests/testsLogger';

let log;
if(process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:author:mutations:changeName');
} else {

    log = appLogger.extend('modules:author:mutations:changeName');
}

const ChangeAuthorName = mutationWithClientMutationId({
    name: 'ChangeAuthorName',
    description: 'Change Author Name',
    inputFields: {
        name: {
            type: GraphQLString
        },
        author: {
            type: GraphQLString
        }
    },
    outputFields: {
        author: {
            type: AuthorType,
            resolve: async (authorIdObj) => {

                const authorFinded = await loadAuthor(authorIdObj.id);
                return authorFinded;
            }
        }
    },
    mutateAndGetPayload: async ({name, author}) => {
        try {

            const {id: authorId} = fromGlobalId(author);

            log('inputed author: ', author);
            log('inputed name: ', name);

            const authorFinded = await loadAuthor(authorId);
            log('authorFinded: ', authorFinded);
            authorFinded.name = name;
            await authorFinded.save();

            return {id: authorFinded.id};
        } catch (err) {

            log('error: ', err);
        }
    }
});

export default ChangeAuthorName;
