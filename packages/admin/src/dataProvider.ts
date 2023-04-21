import crudDataProvider from '@pankod/refine-nestjsx-crud';

import { NEW_API_URL } from '~/const';
import { axios } from '~/authProvider';
import { getUserData } from '~/auth';

const token = getUserData({}, false);

if (token) {
    axios.defaults.headers.common = {
        Authorization: `Bearer ${token}`
    };
}

// @ts-ignore
const dataProvider = crudDataProvider(NEW_API_URL, axios);

export { dataProvider };
