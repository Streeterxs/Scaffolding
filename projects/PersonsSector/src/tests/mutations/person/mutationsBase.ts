import { testsLogger } from "../../testsLogger";

const log = testsLogger.extend('testmutations:person:mutationsQuery');

export type createPersonInput = {
    name: string;
    lastname: string;
};
export const createPersonQuery = ({name, lastname}: createPersonInput) => `
    mutation {
        CreatePerson (input: {name: "${name}", lastname: "${lastname}", clientMutationId: "1"}) {
            person {
                id
                name
                lastname
            }
        }
    }
`;

export type updatePersonInput = {
    name: string;
    lastname: string;
    person: string;
};
export const updatePersonQuery = ({name, lastname, person}: updatePersonInput) => `
    mutation {
        UpdatePerson (input: {name: "${name}", lastname: "${lastname}", person: "${person}", clientMutationId: "2"}) {
            person {
                id
                name
                lastname
            }
        }
    }
`;