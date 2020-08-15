import { Person } from "../modules/person/PersonModel";
import { User } from "../modules/user/UserModel";

import { loadPerson } from "../modules/person/PersonLoader";
import { loadUser } from "../modules/user/UserLoader";



const registeredTypes = [
    {
        name: 'Person',
        qlType: 'PersonType',
        dbType: Person,
        loader: loadPerson
    },
    {
        name: 'User',
        qlType: 'UserType',
        dbType: User,
        loader: loadUser
    }
]

export default registeredTypes;
