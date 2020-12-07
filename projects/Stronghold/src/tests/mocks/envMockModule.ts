import mockedEnv from 'mocked-env';

export const mockedEnvModule = () => {

    const mockedEnvValues = {
        restore: null,
    };

    const mockEnvs = (envMockObject) => {
        mockedEnvValues.restore = mockedEnv({...envMockObject});
    };

    const restore = () => {
        const { restore } = mockedEnvValues;

        if (restore) {

            restore();
        }
    };

    return {
        mockEnvs,
        restore,
    }
};
