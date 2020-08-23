import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLFloat } from "graphql";

import UserType, { userConnection } from "../UserType";
import { User } from "../UserModel";
import { loadUser } from "../UserLoader";

import { appLogger } from "../../../appLogger";
import { testsLogger } from "../../../tests/testsLogger";

let log;

if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:user:mutations:register');
} else {

    log = appLogger.extend('modules:person:mutations:register');
}

const register = mutationWithClientMutationId({
    name: 'Register',
    description: 'Register mutation',
    inputFields: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        permission: { type: new GraphQLNonNull(GraphQLFloat) }
    },
    outputFields: {
        user: {
            type: userConnection.edgeType,
            resolve: (idObj: {id: string}) => {

                if (!idObj.id) {

                    return null;
                }

                return {
                    cursor: toGlobalId('User', idObj.id),
                    node: loadUser(idObj.id)
                }
            }
        }
    },
    mutateAndGetPayload: async ({username, email, password, permission}) => {

        try {

            log('username: ', username);
            log('email: ', email);
            log('password: ', password);
            log('permission: ', permission)

            const newUser = new User({username, email, password, permission});
            await newUser.save();

            return {id: newUser.id};
        } catch(err) {

            log('error: ', err);
        }
    }
});

export default register;