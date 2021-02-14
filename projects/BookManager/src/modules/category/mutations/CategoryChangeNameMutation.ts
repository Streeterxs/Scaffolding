import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";

import { loadCategory } from "../CategoryLoader";
import CategoryType from "../CategoryType";

import { testsLogger } from "../../../tests/testsLogger";
import { appLogger } from "../../../appLogger";

let log;
if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:category:mutations:changeName');
} else {

    log = appLogger.extend('modules:category:mutations:changeName');
}

const ChangeCategoryName = mutationWithClientMutationId({
    name: "ChangeCategoryName",
    description: "Change a category name mutation",
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        category: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        category: {
            type: CategoryType,
            resolve: (categoryIdObj: {id: string}) => {

                if (!categoryIdObj.id) {

                    return null;
                }

                return loadCategory(categoryIdObj.id);
            }
        }
    },
    mutateAndGetPayload: async ({name, category}) => {

        try {

            const {id: categoryId} = fromGlobalId(category);

            const categoryFinded = await loadCategory(categoryId);
            categoryFinded.name = name;
            await categoryFinded.save();

            return {id: categoryId};
        } catch(err) {

            log('error: ', err);
        }
    }
});

export default ChangeCategoryName;
