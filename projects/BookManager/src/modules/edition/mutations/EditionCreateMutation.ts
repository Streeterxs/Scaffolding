import { GraphQLString, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { mutationWithClientMutationId, toGlobalId, fromGlobalId } from 'graphql-relay';

import Edition from '../EditionModel';
import { loadEdition } from '../EditionLoader';
import { EditionConnection } from '../EditionType';

import { appLogger } from '../../../appLogger';
import { testsLogger } from '../../../tests/testsLogger';

let log;
if(process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:edition:mutations:createEdition');
} else {

    log = appLogger.extend('modules:edition:mutations:createEdition');
}

const EditionCreate = mutationWithClientMutationId({
    name: 'EditionCreate',
    description: 'Edition Creation',
    inputFields: {
        edition: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        publishing: {
            type: new GraphQLNonNull(GraphQLString)
        },
        year: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        pages: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        language: {
            type: new GraphQLNonNull(GraphQLString)
        },
        book: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        edition: {
            type: EditionConnection.edgeType,
            resolve: (EditionIdObj: {id: string}) => {

                if (!EditionIdObj.id) {

                    return null;
                };

                return {
                    cursor: toGlobalId('Edition', EditionIdObj.id),
                    node: loadEdition(EditionIdObj.id)
                }
            }
        }
    },
    mutateAndGetPayload: async ({
        edition,
        publishing,
        year,
        pages,
        language,
        book
    }) => {
        try {

            const bookIdOjb = fromGlobalId(book)

            const editionCreated = new Edition({
                edition,
                publishing,
                year,
                pages,
                language,
                book: bookIdOjb.id
            });
            await editionCreated.save();

            return {id: editionCreated.id};
        } catch (err) {

            log('error: ', err);
        }
    }
});

export default EditionCreate;
