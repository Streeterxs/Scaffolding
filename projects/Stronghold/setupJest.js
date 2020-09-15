require('jest-fetch-mock').enableFetchMocks();
// explicit mock fetch object
jest.setMock('node-fetch', fetch);
