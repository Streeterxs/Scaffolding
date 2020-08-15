import { testsLogger } from "../../testsLogger";

const log = testsLogger.extend('testmutations:person:mutationsQuery');

export type registerInput = {
    email: string;
    password: string;
};
export const registerMutationQuery = ({email, password}: registerInput) => `
    mutation {
        Register (input: {email: "${email}", password: "${password}", clientMutationId: "3"}) {
            user {
                cursor
                node {
                    id
                    email
                    tokens
                }
            }
        }
    }
`;