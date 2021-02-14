import { GraphQLString } from "graphql";
import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";

import PersonType from "../PersonType";
import UserType from "../../user/UserType";
import { loadPerson } from "../PersonLoader";
import { loadUser } from "../../user/UserLoader";

import { appLogger } from "../../../appLogger";
import { testsLogger } from "../../../tests/testsLogger";

let log;

if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:person:mutations:PersonRemoveUser');
} else {

    log = appLogger.extend('modules:person:mutations:PersonRemoveUser');
}

const PersonRemoveUser = mutationWithClientMutationId({
    name: 'PersonRemoveUser',
    description:'Remove user mutation',
    inputFields: {
        person: { type: GraphQLString },
        user: { type: GraphQLString }
    },
    outputFields: {
        person: {
            type: PersonType,
            resolve: (idObj: {personId: string}) => {

                if (!idObj.personId) {
                    return null;
                }

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

            const {id: personId} = fromGlobalId(person);
            const {id: userId} = fromGlobalId(user);
            log('personId: ', personId);
            log('userId: ', userId);

            const personFinded = await loadPerson(personId);
            const userFinded = await loadUser(userId);

            const userIndex = personFinded.users.indexOf(userId);

            log('personFinded: ', personFinded);
            log('userFinded: ', userFinded);
            log('userIndex: ', userIndex);
            log('userFinded.person === personId: ', userFinded.person === personId);
            log('userIndex >= 0 && (userFinded.person === personId): ', userIndex >= 0 && (userFinded.person === personId));

            if (userIndex >= 0 && (userFinded.person === personId)) {

                (await personFinded).users.splice(userIndex, 1);
                await personFinded.save();

                userFinded.person = undefined;
                await userFinded.save();

                log('personFinded: ', personFinded);
                log('userFinded: ', userFinded);

                return {
                    personId,
                    userId
                };
            } else {

                throw new Error("This user don't belong to this person");
            }
        } catch (err) {
            log('error: ', err);
        }
    }
});

export default PersonRemoveUser;