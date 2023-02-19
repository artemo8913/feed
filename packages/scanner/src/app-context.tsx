import React from 'react';

export enum AppColor {
    RED,
    GREEN
}

export const Colors = {
    [AppColor.RED]: '#f00',
    [AppColor.GREEN]: '#0f0'
};

export interface IAppContext {
    setColor: (c: AppColor) => void;
    resetColor: () => void;
    setError: (err: string | null) => void;
    setLastUpdated: (ts: number) => void;
    setVolCount: (ts: number) => void;
    pin: string | null;
    setPin: (pin: string) => void;
    setAuth: (auth: boolean) => void;
}

// @ts-ignore
const AppContext = React.createContext<IAppContext>(null);

export { AppContext };
