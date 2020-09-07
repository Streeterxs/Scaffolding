import fetch from 'node-fetch';

export const visitorRequest = async ({baseurl, route, headers}) => {

    return await fetch(`${baseurl}/${route /* example */}`, {
        headers,
        method: 'GET'
    });
};

export const authenticateRequest = async ({baseurl, route, headers}) => {

    return await fetch(`${baseurl}/${route /* example */}`, {
        headers: {headers},
        method: 'POST'
    });
};
