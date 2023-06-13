import type { AuthProvider } from '@pankod/refine-core';
import axios from 'axios';

import { clearUserData, getUserData, setUserData, setUserInfo } from '~/auth';
import { NEW_API_URL } from '~/const';

export const authProvider: AuthProvider = {
    login: async ({ password, username }) => {
        try {
            axios.defaults.headers.common = {};

            const { data, status } = await axios.post(`${NEW_API_URL}/auth/login/`, {
                username,
                password
            });

            if (status !== 200) return Promise.reject();

            const { key } = data;

            setUserData(key);

            return Promise.resolve('/');
        } catch (e) {
            return Promise.reject(e);
        }
    },
    logout: () => {
        clearUserData();
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async (ctx) => {
        const user = await getUserData(ctx, true);

        if (!user) {
            return Promise.reject();
        }

        return Promise.resolve({ user });
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async (ctx) => {
        const user = await getUserData(ctx, true);
        if (!user) return Promise.reject();

        return Promise.resolve(user);
    }
};

export { axios };
