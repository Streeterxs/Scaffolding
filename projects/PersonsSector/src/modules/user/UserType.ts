import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { globalIdField, connectionDefinitions } from "graphql-relay";

import { IUser } from "./UserModel";
import { loadPerson } from "../person/PersonLoader";
import { nodeInterface } from "../../interface/nodeDefinitions";

import PersonType from "../person/PersonType";
import { permissions } from "./UserPermissions.enum";

const userType = new GraphQLObjectType({
    name: 'UserType',
    description: 'Type for user',
    interfaces: [ nodeInterface ],
    fields: () => ({
        id: globalIdField('User'),
        username: {
            type: GraphQLString,
            resolve: (user: IUser) => user.username
        },
        email: {
            type: GraphQLString,
            resolve: (user: IUser) => user.email
        },
        tokens: {
            type: new GraphQLList(GraphQLString),
            resolve: (user: IUser) => user.tokens
        },
        person: {
            type: PersonType,
            resolve: (user: IUser) => loadPerson(user.person)
        },
        permission: {
            type: GraphQLString,
            resolve: (user: IUser) => permissions[user.permission]
        }
    })
});

export const userConnection =
    // TODO correct types
    // Don't use GraphQLNonNull or 'undefinedConnection' is created
    connectionDefinitions({name: 'User', nodeType: userType});

export default userType;