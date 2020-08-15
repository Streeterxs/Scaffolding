import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { globalIdField, connectionDefinitions } from "graphql-relay";

import { IUser } from "./UserModel";
import { loadPerson } from "../person/PersonLoader";
import { nodeInterface } from "../../interface/nodeDefinitions";

const userType = new GraphQLObjectType({
    name: 'UserType',
    description: 'Type for user',
    interfaces: [ nodeInterface ],
    fields: () => ({
        id: globalIdField('User'),
        email: {
            type: GraphQLString,
            resolve: (user: IUser) => user.email
        },
        tokens: {
            type: new GraphQLList(GraphQLString),
            resolve: (user: IUser) => user.tokens
        },
        person: {
            type: GraphQLString,
            resolve: (user: IUser) => loadPerson(user.person)
        }
    })
});

export const userConnection =
    // TODO correct types
    // Don't use GraphQLNonNull or 'undefinedConnection' is created
    connectionDefinitions({name: 'User', nodeType: userType});

export default userType;