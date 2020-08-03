import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import Category from '../CategoryModel';
import { loadCategory } from '../CategoryLoader';
import { CategoryConnection } from '../CategoryType';

import { testsLogger } from '../../../tests/testsLogger';
import { appLogger } from '../../../appLogger';

let log;
if(process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:category:mutations:createCategory');
} else {

    log = appLogger.extend('modules:category:mutations:createCategory');
}

const CategoryCreation = mutationWithClientMutationId({
    name: 'CategoryCreation',
    description: 'Category Creation',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        category: {
            type: CategoryConnection.edgeType,
            resolve: async (categoryIdObj: {id: string}) => {

                if (!categoryIdObj.id) {

                    return null;
                };

                return {
                    cursor: toGlobalId('Category', categoryIdObj.id),
                    node: await loadCategory(categoryIdObj.id)
                }
            }
        }
    },
    mutateAndGetPayload: async ({name}) => {
        try {

            const CategoryCreated = new Category({name});
            await CategoryCreated.save();

            return {id: CategoryCreated.id};
        } catch (err) {

            log('error: ', err);
        }
    }
});

export default CategoryCreation;
