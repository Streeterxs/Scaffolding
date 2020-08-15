import { GraphQLObjectType } from "graphql";

import PersonMutations from "../modules/person/mutations";
import UserMutations from "../modules/user/mutations";

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Type for mutation',
    fields: () => ({
        ...PersonMutations
    })
});

export default MutationType;
