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
            resolve: (categoryId: string) => {

                if (!categoryId) {

                    return null;
                };

                return {
                    cursor: toGlobalId('Category', categoryId),
                    node: loadCategory(categoryId)
                }
            }
        }
    },
    mutateAndGetPayload: async ({name}) => {
        try {

            const CategoryCreated = new Category({name});
            await CategoryCreated.save();

            return CategoryCreated.id;
        } catch (err) {

            console.log(err);
        }
    }
});

export default CategoryCreation;
