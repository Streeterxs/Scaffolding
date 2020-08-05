import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule, changeBookNameMutation } from '../../../tests/mutations';
import { testsLogger } from '../../../tests/testsLogger';

const log = testsLogger.extend('bookMutations');

describe('book mutations', () => {

    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createCategory, addCategoryToBook, changeBookName, changeAuthorBook } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        authorId = `${(await createAuthor('New Author To Book')).body.data.AuthorCreation.author.id}`;
        log('authorId: ', authorId);
    })

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new book', async () => {

        log('authorid: ', authorId);
        const objToCreateBook = {name: 'New Book', author: authorId, categories: []};
        log('objToCreateBook: ', objToCreateBook);
        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});

        log('bookResponse body: ', bookResponse.body);
        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreation).toBeTruthy();
    });

    it('should add category to a book', async () => {

        const categoryResponse = await createCategory('New Category');
        expect(categoryResponse.body.data.CategoryCreation).toBeTruthy();


        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});
        expect(bookResponse.body.data.BookCreation).toBeTruthy();

        const {cursor: bookId} = bookResponse.body.data.BookCreation.book;
        const {cursor: categoryId} = categoryResponse.body.data.CategoryCreation.category;

        const addCategoryResponse = await addCategoryToBook(bookId, categoryId);

        expect(addCategoryResponse.status).toBe(200);
        expect(addCategoryResponse.body.data.AddCategory).toBeTruthy();
        expect(addCategoryResponse.body.data.AddCategory.book.categories.edges[0].node.id).toBe(categoryId);

    });

    it('should change a book name', async () => {

        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});
        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreation).toBeTruthy();
        log('bookResponse change book name: ', bookResponse.body.data.BookCreation);

        const newName = 'New Book Name';
        const {id: bookId} = bookResponse.body.data.BookCreation.book.node;

        const changeBookNameResponse = await changeBookName({name: newName, book: bookId});
        log(changeBookNameResponse.body)
        expect(changeBookNameResponse.status).toBe(200);
        expect(changeBookNameResponse.body.data.ChangeBookName).toBeTruthy();
        expect(changeBookNameResponse.body.data.ChangeBookName.book.name).toBe(newName);
        expect(changeBookNameResponse.body.data.ChangeBookName.book.updatedAt).not.toBe(bookResponse.body.data.BookCreation.book.updatedAt);
    });

    it('Should change author from a book', async () => {

        log('authorid: ', authorId);
        const objToCreateBook = {name: 'New Book', author: authorId, categories: []};
        log('objToCreateBook: ', objToCreateBook);
        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});

        log('bookResponse body: ', bookResponse.body);
        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreation).toBeTruthy();

        const newAuthorResponse = await createAuthor('New Author Name');
        expect(newAuthorResponse.status).toBe(200);
        expect(newAuthorResponse.body.data.AuthorCreation).toBeTruthy();

        const {id: newAuthorId} = newAuthorResponse.body.data.AuthorCreation.author;
        const {cursor: bookId} = bookResponse.body.data.BookCreation.book;

        const changeAuthorBookResponse = await changeAuthorBook({book: bookId, author: newAuthorId});
        log('changeAuthorBookResponse.body: ', changeAuthorBookResponse.body);
        expect(changeAuthorBookResponse.status).toBe(200);
        expect(changeAuthorBookResponse.body.data.ChangeAuthorBook).toBeTruthy();
        expect(changeAuthorBookResponse.body.data.ChangeAuthorBook.book.author.id).toBe(newAuthorId);
        expect(changeAuthorBookResponse.body.data.ChangeAuthorBook.lastAuthor.id).toBe(authorId);
        expect(changeAuthorBookResponse.body.data.ChangeAuthorBook.author.books.edges[0].node.id).toBe(bookId);
    });
});
