import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import PersonType from "../PersonType";
import { loadPerson } from "../PersonLoader";
import { Person } from "../PersonModel";
import { testsLogger } from "../../../tests/testsLogger";
import { appLogger } from "../../../appLogger";

let log;

if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:person:mutations:PersonCreate');
} else {

    log = appLogger.extend('modules:person:mutations:PersonCreate');
}

const PersonCreate = mutationWithClientMutationId({
    name: 'PersonCreate',
    description: 'Create person mutation',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        lastname: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        person: {
            type: PersonType,
            resolve: (idObj: {id: string}) => {

                if (!idObj.id) {
                    return null;
                }

                return loadPerson(idObj.id);
            }
        }
    },
    mutateAndGetPayload: async ({name, lastname}) => {

        try {

            const newPerson = new Person({name, lastname});
            await newPerson.save();

            return {id: newPerson.id};
        } catch(err) {

            log('error: ', err);
        }
    }
});

export default PersonCreate;
