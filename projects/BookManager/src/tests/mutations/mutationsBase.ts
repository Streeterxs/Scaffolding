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

export const createBookMutation = ({name, author, categories=[]}) => `
    mutation {
        BookCreation(input: {name: "${name}", author: "${author}", categories: ${categories} clientMutationId: "1"}) {
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
        AddCategory(input: {book: "${bookId}", category: "${categoryId}"}) {
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
            clientMutationId: "1"}) {
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

export const createCategoryMutation = (name: string) => `
    mutation {
        CategoryCreation(input: {name: "${name}", clientMutationId: "1"}) {
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
