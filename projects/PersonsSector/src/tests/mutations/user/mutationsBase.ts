import { testsLogger } from "../../testsLogger";

const log = testsLogger.extend('testmutations:person:mutationsQuery');

export type registerInput = {
    username: string;
    email: string;
    password: string;
    permission: number;
};
export const registerMutationQuery = ({username, email, password, permission}: registerInput) => `
    mutation {
        UserRegister (input: {username:"${username}", email: "${email}", password: "${password}", permission: ${permission}, clientMutationId: "3"}) {
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