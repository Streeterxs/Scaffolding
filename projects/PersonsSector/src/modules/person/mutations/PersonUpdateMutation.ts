import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLString } from "graphql";

import PersonType from "../PersonType";
import { loadPerson } from "../PersonLoader";

import { testsLogger } from "../../../tests/testsLogger";
import { appLogger } from "../../../appLogger";
import { IPerson } from "../PersonModel";

let log;

if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:person:mutations:updatePerson');
} else {

    log = appLogger.extend('modules:person:mutations:updatePerson');
}

const updatePerson = mutationWithClientMutationId({
    name: 'UpdatePerson',
    description: 'Mutation for updating person',
    inputFields: {
        name: { type: GraphQLString },
        lastname: { type: GraphQLString },
        person: { type: GraphQLString }
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
    mutateAndGetPayload: async ({name, lastname, person}) => {
        try {

            const {id: personId} = fromGlobalId(person);

            const personFinded = await loadPerson(personId);
            editSanitizer(personFinded,
                    {key: 'name', value: name},
                    {key: 'lastname', value: lastname}
                );
            await personFinded.save();

            return {id: personId};
        } catch(err) {

            log('error: ', err);
        }
    }
});

const editSanitizer = (person: IPerson, ...args: {key: string, value: any}[]) => {

    args.forEach(arg => {
        if (arg.value) {

            log('arg: ', arg);
            log('arg.key: ', arg.key);
            log('arg.value: ', arg.value);
            log('typeof arg.value: ', typeof arg.value);
            log('edition[arg.key]: ', person[arg.key]);
            person[arg.key] = arg.value;
        }
    });
};

export default updatePerson;