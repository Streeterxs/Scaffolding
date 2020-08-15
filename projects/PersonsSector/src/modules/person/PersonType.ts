import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField, connectionFromArray, connectionDefinitions, connectionArgs } from "graphql-relay";

import { IPerson } from "./PersonModel";
import { loadUser } from "../user/UserLoader";
import { userConnection } from "../user/UserType";

const personType = new GraphQLObjectType({
    name: 'PersonType',
    description: 'A type object of person model',
    fields: () => ({
        id: globalIdField('Person'),
        name: {
            type: GraphQLString,
            resolve: (person: IPerson) => person.name
        },
        lastname: {
            type: GraphQLString,
            resolve: (person: IPerson) => person.lastname
        },
        users: {
            type: userConnection.connectionType,
            args: connectionArgs,
            resolve: (person: IPerson, args) => connectionFromArray(person.users.map(loadUser), args)
        }
    })
});

export const personConnection =
    // TODO correct types
    // Don't use GraphQLNonNull or 'undefinedConnection' is created
    connectionDefinitions({name: 'Person', nodeType: personType});

export default personType;
