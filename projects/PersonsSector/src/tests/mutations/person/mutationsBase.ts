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

export type addUserInput = {
    person: string;
    user: string;
};
export const addUserQuery = ({person, user}: addUserInput) => `
    mutation {
        AddUser (input: {person: "${person}", user: "${user}", clientMutationId: "4"}) {
            person {
                id
                name
                lastname
                users {
                    edges {
                        cursor
                        node {
                            id
                            email
                        }
                    }
                }
            }
            user {
                id
                email
                tokens
                person {
                    id
                    name
                    lastname
                }
            }
        }
    }
`;

export type removeUserInput = {
    person: string;
    user: string;
};
export const removeUserQuery = ({person, user}: removeUserInput) => `
    mutation {
        RemoveUser (input: {person: "${person}", user: "${user}", clientMutationId: "5"}) {
            person {
                id
                name
                lastname
                users {
                    edges {
                        cursor
                        node {
                            id
                        }
                    }
                }
            }
            user {
                id
                email
                person {
                    id
                }
            }
        }
    }
`;