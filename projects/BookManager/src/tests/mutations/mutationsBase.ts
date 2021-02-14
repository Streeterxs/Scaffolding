import { testsLogger } from "../testsLogger";
import ChangeCategoryName from "../../modules/category/mutations/CategoryChangeNameMutation";
import ChangeBookEdition from "../../modules/edition/mutations/changeBookEdition";

const log = testsLogger.extend('mutationsQuery');
export const createAuthorMutation = (name: string) => `
    mutation {
        AuthorCreation(input: {name: "${name}", clientMutationId: "1"}) {
            author {
                id
                name
                createdAt
                updatedAt
            }
        }
    }
`;

export const changeAuthorNameMutation = (name: string, author: string) => `
    mutation {
        ChangeAuthorName(input: {name: "${name}", author: "${author}", clientMutationId: "2"}) {
            author {
                id
                name
                createdAt
                updatedAt
            }
        }
    }
`;

export const addBookToAuthorMutation = (authorId: string, bookId: string) => `
    mutation {
        AddBook(input: {author: "${authorId}", book: "${bookId}", clientMutationId: "3"}) {
            author {
                name
                books {
                    edges {
                        cursor
                        node {
                            id
                            name
                            createdAt
                            updatedAt
                        }
                    }
                }
                createdAt
                updatedAt
            }
        }
    }
`;


export type createBookMutationInput = {
    name: string,
    author: string,
    categories: string[]
}
export const createBookMutation = ({name, author, categories=[]}: createBookMutationInput) => `
    mutation {
        BookCreation(input: {name: "${name}", author: "${author}", categories: ${JSON.stringify(categories)}, clientMutationId: "4"}) {
            book {
                cursor
                node {
                    id
                    name
                    author {
                        name
                    }
                    createdAt
                    updatedAt
                }
            }
        }
    }
`;

export const addCategoryToBookMutation = (bookId, categoryId) => `
    mutation {
        AddCategory(input: {book: "${bookId}", category: "${categoryId}", clientMutationId: "5"}) {
            book {
                id
                name
                author {
                    name
                }
                categories {
                    edges {
                        cursor
                        node {
                            id
                            name
                        }
                    }
                }
                createdAt
                updatedAt
            }
        }
    }
`;

export type ChangeBookNameInput = {
    name: string,
    book: string
};
export const changeBookNameMutation = (changeBookNameObj: ChangeBookNameInput) => `
    mutation {
        ChangeBookName(input: {name: "${changeBookNameObj.name}", book: "${changeBookNameObj.book}", clientMutationId: "6"}) {
            book {
                id
                name
                createdAt
                updatedAt
            }
        }
    }
`;

export type ChangeAuthorBookInput = {
    book: string;
    author: string;
};
export const changeAuthorBookMutations = ({book, author}: ChangeAuthorBookInput) => `
    mutation {
        ChangeAuthorBook (input: {book: "${book}", author: "${author}", clientMutationId: "12"}) {
            book {
                id
                name
                author {
                    id
                    name
                }
                updatedAt
            }
            author {
                id
                name
                books {
                    edges {
                        cursor
                        node {
                            id
                        }
                    }
                }
            }
            lastAuthor {
                id
                name
                books {
                    edges {
                        cursor
                    }
                }
            }
        }
    }
`;

export type createEditionMutationInput = {
    edition: number,
    book: string,
    publishing: string,
    year: number,
    pages: number,
    language: string
}
export const createEditionMutation = (
        {
            edition=1,
            book='New Book',
            publishing='New Publisher',
            year=1952,
            pages=1000,
            language='English'
        }: createEditionMutationInput
    ) => `
    mutation {
        EditionCreation(input: {
            edition: ${edition},
            publishing: "${publishing}",
            year: ${year},
            pages: ${pages},
            language: "${language}",
            book: "${book}",
            clientMutationId: "7"}) {
            edition {
                cursor
                node {
                    id
                    edition
                    publishing
                    year
                    pages
                    language
                    createdAt
                    updatedAt
                }
            }
        }
    }
`;

export type EditEditionInput = {
    editionIdentifier: string;
    edition?: number;
    publishing?: string;
    year?: number;
    pages?: number;
    language?: string
};
export const editEditionMutation = ({
    editionIdentifier,
    edition,
    publishing,
    year,
    pages,
    language
}: EditEditionInput) => `
    mutation {
        EditEdition (
            input: {
                editionIdentifier: "${editionIdentifier}",
                ${edition ? `edition: ${edition},` : ''}
                ${publishing ? `publishing: "${publishing}",` : ''}
                ${year ? `year: ${year},` : ''}
                ${pages ? `pages: ${pages},` : ''}
                ${language ? `language: "${language}",` : ''}
                clientMutationId: "10"
            }
        ) {
            edition {
                id
                edition
                publishing
                year
                pages
                language
            }
        }
    }
`;

export type ChangeBookEditionInput = {
    book: string;
    edition: string;
};
export const changeBookEditionMutation = ({book, edition}: ChangeBookEditionInput) => `
    mutation {
        ChangeBookEdition(input: {book: "${book}", edition: "${edition}", clientMutationId: "11"}){
            edition {
                id
                edition
                book {
                    id
                    name
                }
                publishing
            }
            book {
                id
                name
            }
            lastBook {
                id
                name
            }
        }
    }
`;

export const createCategoryMutation = (name: string) => `
    mutation {
        CategoryCreation(input: {name: "${name}", clientMutationId: "8"}) {
            category {
                cursor
                node {
                    id
                    name
                    createdAt
                    updatedAt
                }
            }
        }
    }
`;

export type ChangeCategoryNameInput = {
    name: string;
    category: string;
};

export const changeCategoryNameMutation = ({name, category}: ChangeCategoryNameInput) => `
    mutation {
        ChangeCategoryName(input: {name: "${name}", category: "${category}", clientMutationId: "9"}) {
            category {
                id
                name
                updatedAt
            }
        }
    }
`;
