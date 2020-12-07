import mockedEnv from 'mocked-env';

export const mockedEnvModule = () => {

    const mockedEnvValues = {
        restore: null,
    };

    const mockEnvs = (envMockObject) => {
        mockedEnvValues.restore = mockedEnv({...envMockObject});
    };

    const restore = () => {

        if (mockedEnvValues.restore) {

            mockedEnvValues.restore();
        }
    };

    return {
        mockEnvs,
        restore,
    }
};
