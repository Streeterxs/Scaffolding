import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('authorMutations');

describe('AuthorChangeNameMutation', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, changeAuthorName } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should change author name', async () => {

        const createAuthorResponse = await createAuthor('New Author');
        log('createAuthorResponse body: ', createAuthorResponse.body);
        expect(createAuthorResponse.status).toBe(200);
        expect(createAuthorResponse.body.data.AuthorCreate).toBeTruthy();

        const {id: authorId, name, updatedAt} = createAuthorResponse.body.data.AuthorCreate.author;
        const newName = 'New Name';

        const changeAuthorNameResponse = await changeAuthorName(newName, authorId);
        log('changeAuthorNameResponse body: ', changeAuthorNameResponse.body);
        log('changeAuthorNameResponse body.data: ', changeAuthorNameResponse.body.data);
        expect(changeAuthorNameResponse.status).toBe(200);
        expect(changeAuthorNameResponse.body.data.AuthorChangeName).toBeTruthy();
        expect(changeAuthorNameResponse.body.data.AuthorChangeName.author.name).toBe(newName);
        expect(changeAuthorNameResponse.body.data.AuthorChangeName.author.name).not.toBe(name);
        expect(changeAuthorNameResponse.body.data.AuthorChangeName.author.updatedAt).not.toBe(updatedAt);
    });
});
