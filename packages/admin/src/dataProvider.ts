import type { AxiosInstance } from 'axios';
import crudDataProvider from '@pankod/refine-nestjsx-crud';

import { API_URL } from '~/const';
import { axios } from '~/authProvider';

const http: AxiosInstance = axios.create();
const dataProvider = crudDataProvider(API_URL, http);

export { dataProvider };
