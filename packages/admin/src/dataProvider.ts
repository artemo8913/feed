import crudDataProvider from '@pankod/refine-nestjsx-crud';

import { API_URL } from '~/const';
import { axios } from '~/authProvider';

const dataProvider = crudDataProvider(API_URL, axios);

export { dataProvider };
