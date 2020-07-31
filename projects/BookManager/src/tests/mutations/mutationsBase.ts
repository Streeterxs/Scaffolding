export const createAuthorMutation = () => `
    mutation {
        AuthorCreation(input: {name: "New Author", clientMutationId: "1"}) {
            author {
                id
                name
                createdAt
                updatedAt
            }
        }
    }
`;

export const createBookMutation = (authorId) => `
    mutation {
        BookCreation(input: {name: "New book", author: "${authorId}", categories: [] clientMutationId: "1"}) {
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

export const createEditionMutation = (bookId) => `
    mutation {
        EditionCreation(input: {
            edition: 1,
            publishing: "New Publisher",
            year: 1952,
            pages: 1000,
            language: "English",
            book: "${bookId}",
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

export const createCategoryMutation = () => `
    mutation {
        CategoryCreation(input: {name: "New category", clientMutationId: "1"}) {
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
