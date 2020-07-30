import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import Category from '../CategoryModel';
import { loadCategory } from '../CategoryLoader';
import { CategoryConnection } from '../CategoryType';

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

            console.log(err);
        }
    }
});

export default CategoryCreation;
