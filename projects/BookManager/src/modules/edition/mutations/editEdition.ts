import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLFloat } from "graphql";

import EditionType from "../EditionType";
import { loadEdition } from "../EditionLoader";

import { testsLogger } from "../../../tests/testsLogger";
import { appLogger } from "../../../appLogger";
import { IEdition } from "../EditionModel";

let log;

if (process.env.JEST_WORKER_ID) {
    log = testsLogger.extend('modules:edition:mutations:editEdition');
} else {
    log = appLogger.extend('modules:edition:mutations:editEdition');
}

const EditEdition = mutationWithClientMutationId({
    name: 'EditEdition',
    description: 'Edit edition mutation',
    inputFields: {
        editionIdentifier: {
            type: new GraphQLNonNull(GraphQLString)
        },
        edition: {
            type: GraphQLFloat
        },
        publishing: {
            type: GraphQLString
        },
        year: {
            type: GraphQLFloat
        },
        pages: {
            type: GraphQLFloat
        },
        language: {
            type: GraphQLString
        },
        book: {
            type: GraphQLString
        }
    },
    outputFields: {
        edition: {
            type: EditionType,
            resolve: (editionIdObj: {id: string}) => {

                if (!editionIdObj.id) {
                    return null;
                }

                return loadEdition(editionIdObj.id);
            }
        }
    },
    mutateAndGetPayload: async ({
        editionIdentifier,
        edition,
        publishing,
        year,
        pages,
        language
    }) => {

        try {

            const {id: editionId} = fromGlobalId(editionIdentifier);

            const editionFinded = await loadEdition(editionId);
            editSanitizer(
                editionFinded,
                {key: 'edition', value: edition},
                {key: 'publishing', value: publishing},
                {key: 'year', value: year},
                {key: 'pages', value: pages},
                {key: 'language', value: language});
            await editionFinded.save();

            return {id: editionId};
        } catch (err) {

            log('error: ', err);
        }
    }
});

const editSanitizer = (edition: IEdition, ...args: {key: string, value: any}[]) => {

    args.forEach(arg => {
        if (arg.value) {
            log('arg: ', arg);
            log('arg.key: ', arg.key);
            log('arg.value: ', arg.value);
            log('typeof arg.value: ', typeof arg.value);
            log('edition[arg.key]: ', edition[arg.key]);
            edition[arg.key] = arg.value;
        }
    });
};

export default EditEdition;
