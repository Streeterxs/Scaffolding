import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";

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
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
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
    mutateAndGetPayload: async ({email, password}) => {

        try {

            log('email: ', email);
            log('password: ', password);

            const newUser = new User({email, password});
            await newUser.save();

            return {id: newUser.id};
        } catch(err) {

            log('error: ', err);
        }
    }
});

export default register;