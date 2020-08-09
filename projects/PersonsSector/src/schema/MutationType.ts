import { GraphQLObjectType } from "graphql";

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Type for mutation',
    fields: () => ({})
});

export default MutationType;
