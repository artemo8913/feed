// import crudDataProvider from '@pankod/refine-nestjsx-crud';
import type { CrudFilter, DataProvider, LogicalFilter } from '@pankod/refine-core';
import type { AxiosInstance } from 'axios';
import { stringify } from 'query-string';

import { NEW_API_URL } from '~/const';
import { axios } from '~/authProvider';

// import { DataProvider } from "@refinedev/core";
// import { axiosInstance, generateSort, generateFilter } from "./utils";

type MethodTypes = 'get' | 'delete' | 'head' | 'options';
type MethodTypesWithBody = 'post' | 'put' | 'patch';

function isLogicalFilter(filter: CrudFilter): filter is LogicalFilter {
    return (filter as LogicalFilter).field !== undefined;
}

export const crudDataProvider = (
    apiUrl: string,
    httpClient: AxiosInstance = axios
): Omit<Required<DataProvider>, 'createMany' | 'updateMany' | 'deleteMany' | 'custom'> => ({
    getList: async ({ filters, metaData, pagination, /*sorters,*/ resource }) => {
        const url = `${apiUrl}/${resource}/`;

        const {
            current = 1,
            pageSize = 10
            // mode = "server",
        } = pagination ?? {};

        const { headers: headersFromMeta, method } = metaData ?? {};
        const requestMethod = (method as MethodTypes) ?? 'get';

        // const queryFilters = generateFilter(filters);

        // const query: {
        //     _start?: number;
        //     _end?: number;
        //     _sort?: string;
        //     _order?: string;
        // } = {};

        // if (mode === "server") {
        // query._start = (current - 1) * pageSize;
        // query._end = current * pageSize;
        // }

        // const generatedSort = generateSort(sorters);
        // if (generatedSort) {
        //     const { _sort, _order } = generatedSort;
        //     query._sort = _sort.join(",");
        //     query._order = _order.join(",");
        // }

        const { data } = await httpClient[requestMethod](
            `${url}`,
            // `${url}?${stringify(query)}&${stringify(queryFilters)}`,
            {
                params: {
                    ...filters?.reduce(
                        (acc, filter) =>
                            isLogicalFilter(filter)
                                ? {
                                      ...acc,
                                      [filter.field]: filter.value
                                  }
                                : acc,
                        {}
                    ),
                    limit: 10000
                },
                headers: headersFromMeta
            }
        );

        return {
            data: data.results,
            total: data.count
        };
    },

    getMany: async ({ ids, metaData, resource }) => {
        const { headers, method } = metaData ?? {};
        const requestMethod = (method as MethodTypes) ?? 'get';

        const { data } = await httpClient[requestMethod](`${apiUrl}/${resource}?${stringify({ id: ids })}`, {
            headers
        });

        return {
            data
        };
    },

    create: async ({ metaData, resource, variables }) => {
        const url = `${apiUrl}/${resource}/`;

        const { headers, method } = metaData ?? {};
        const requestMethod = (method as MethodTypesWithBody) ?? 'post';

        const { data } = await httpClient[requestMethod](url, variables, {
            headers
        });

        return {
            data
        };
    },

    update: async ({ id, metaData, resource, variables }) => {
        const url = `${apiUrl}/${resource}/${id}/`;

        const { headers, method } = metaData ?? {};
        const requestMethod = (method as MethodTypesWithBody) ?? 'patch';

        const { data } = await httpClient[requestMethod](url, variables, {
            headers
        });

        return {
            data
        };
    },

    getOne: async ({ id, metaData, resource }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { headers, method } = metaData ?? {};
        const requestMethod = (method as MethodTypes) ?? 'get';

        const { data } = await httpClient[requestMethod](url, { headers });

        return {
            data
        };
    },

    deleteOne: async ({ id, metaData, resource, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { headers, method } = metaData ?? {};
        const requestMethod = (method as MethodTypesWithBody) ?? 'delete';

        const { data } = await httpClient[requestMethod](url, {
            data: variables,
            headers
        });

        return {
            data
        };
    },

    getApiUrl: () => {
        return apiUrl;
    }

    // custom: async ({
    //     url,
    //     method,
    //     filters,
    //     sorters,
    //     payload,
    //     query,
    //     headers,
    // }) => {
    //     let requestUrl = `${url}?`;

    //     if (sorters) {
    //         const generatedSort = generateSort(sorters);
    //         if (generatedSort) {
    //             const { _sort, _order } = generatedSort;
    //             const sortQuery = {
    //                 _sort: _sort.join(","),
    //                 _order: _order.join(","),
    //             };
    //             requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
    //         }
    //     }

    //     if (filters) {
    //         const filterQuery = generateFilter(filters);
    //         requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    //     }

    //     if (query) {
    //         requestUrl = `${requestUrl}&${stringify(query)}`;
    //     }

    //     if (headers) {
    //         httpClient.defaults.headers = {
    //             ...httpClient.defaults.headers,
    //             ...headers,
    //         };
    //     }

    //     let axiosResponse;
    //     switch (method) {
    //         case "put":
    //         case "post":
    //         case "patch":
    //             axiosResponse = await httpClient[method](url, payload);
    //             break;
    //         case "delete":
    //             axiosResponse = await httpClient.delete(url, {
    //                 data: payload,
    //             });
    //             break;
    //         default:
    //             axiosResponse = await httpClient.get(requestUrl);
    //             break;
    //     }

    //     const { data } = axiosResponse;

    //     return Promise.resolve({ data });
    // },
});

// // @ts-ignore
const dataProvider = crudDataProvider(NEW_API_URL, axios);

export { dataProvider };
