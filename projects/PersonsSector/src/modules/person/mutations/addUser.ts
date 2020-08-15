import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";

import PersonType from "../PersonType";
import { loadPerson } from "../PersonLoader";

import UserType from "../../user/UserType";
import { loadUser } from "../../user/UserLoader";

import { testsLogger } from "../../../tests/testsLogger";
import { appLogger } from "../../../appLogger";

let log;

if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:person:mutations:addUser');
} else {

    log = appLogger.extend('modules:person:mutations:addUser');
}

const addUser = mutationWithClientMutationId({
    name: 'AddUser',
    description: 'Add a user to a person mutation',
    inputFields: {
        person: { type: new GraphQLNonNull(GraphQLString) },
        user: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        person: {
            type: PersonType,
            resolve: async (idObj: {personId: string}) => {

                if (!idObj.personId) {

                    return null;
                }

                const personFinded = await loadPerson(idObj.personId);

                log('resolve person finded: ', personFinded);
                return loadPerson(idObj.personId);
            }
        },
        user: {
            type: UserType,
            resolve: (idObj: {userId: string}) => {

                if (!idObj.userId) {

                    return null;
                }

                return loadUser(idObj.userId);
            }
        }
    },
    mutateAndGetPayload: async ({person, user}) => {
        try {

            log('person: ', person);
            log('user: ', user);

            const {id: personId} = fromGlobalId(person);
            const {id: userId} = fromGlobalId(user);

            const personFinded = await loadPerson(personId);
            (await personFinded).users.splice(0, 0, userId);
            await personFinded.save();
            log('personFinded.users: ', personFinded.users);

            const userFinded = await loadUser(userId);
            userFinded.person = personId;
            await userFinded.save();
            log('userFinded.person: ', userFinded.person);

            return {
                personId,
                userId
            };
        } catch(err) {

            log('error: ', err);
        }
    }
});

export default addUser;
