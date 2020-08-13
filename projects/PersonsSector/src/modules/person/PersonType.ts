import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { IPerson } from "./PersonModel";
import { loadUser } from "../user/UserLoader";

const personType = new GraphQLObjectType({
    name: 'PersonType',
    description: 'A type object of person model',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: (person: IPerson) => person.name
        },
        lastname: {
            type: GraphQLString,
            resolve: (person: IPerson) => person.lastname
        },
        users: {
            type: new GraphQLList(GraphQLString),
            resolve: (person: IPerson) => person.users.map(loadUser)
        }
    })
});

export default personType;
