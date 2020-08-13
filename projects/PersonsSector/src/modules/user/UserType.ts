import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

import { IUser } from "./UserModel";
import { loadPerson } from "../person/PersonLoader";

const userType = new GraphQLObjectType({
    name: 'UserType',
    description: 'Type for user',
    fields: () => ({
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

export default userType;