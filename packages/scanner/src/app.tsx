import './wdyr';

import type { FC, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import SwipeableViews from 'react-swipeable-views';

import '~/lib/date';

import type { AppColor, IAppContext } from '~/app-context';
import { AppContext, Colors } from '~/app-context';
import { API_DOMAIN } from '~/config';
import css from '~/app.module.css';
import { Left1Screen } from '~/screens/left1';
import { MainScreen } from '~/screens/main';
import { Right1Screen } from '~/screens/rigth1';
import { useCheckAuth } from '~/request';
// import { clearCache } from './lib/utils';
// eslint-disable-next-line import/no-unresolved
import ver from '!!raw-loader!pwa-ver.txt';

console.log(`local app ver: ${ver}`);

const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
    <div role='alert'>
        <p>я сломался</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>ПЕРЕЗАГРУЗИТЬ</button>
    </div>
);

const storedPin = localStorage.getItem('pin');

const App: FC = () => {
    const [appColor, setAppColor] = useState<AppColor | null>(null);
    const [appError, setAppError] = useState<string | null>(null);
    const [pin, setPin] = useState<string | null>(storedPin);
    const [auth, setAuth] = useState<boolean>(true);
    const pinInputRef = useRef<HTMLInputElement | null>(null);
    const checkAuth = useCheckAuth(API_DOMAIN, setAuth);
    const appStyle = useMemo(() => ({ backgroundColor: Colors[appColor as AppColor] }), [appColor]);
    const [lastUpdate, setLastUpdated] = useState<number | null>(null);
    const [volCount, setVolCount] = useState<number>(0);

    const tryAuth = useCallback(() => {
        const enteredPin = pinInputRef.current?.value || '';
        checkAuth(enteredPin)
            .then((_) => {
                localStorage.setItem('pin', enteredPin);
                setAuth(true);
                setPin(enteredPin);
            })
            .catch((_) => {
                localStorage.removeItem('pin');
                setAuth(false);
                setPin(null);
                alert('Неверный пин!');
            });
    }, [checkAuth]);

    const contextValue: IAppContext = useMemo(
        () => ({
            pin,
            setPin,
            setAuth,
            appError,
            setColor: setAppColor,
            lastUpdate,
            volCount,
            resetColor: () => setAppColor(null),
            setError: setAppError,
            setLastUpdated: (ts) => {
                localStorage.setItem('lastUpdated', String(ts));
                setLastUpdated(ts);
            },
            setVolCount
        }),
        [pin, lastUpdate, volCount]
    );

    useEffect(() => {
        const checkVer = (): void => {
            console.log('online, check ver..');
            void axios.get('public/pwa-ver.txt').then(({ data }: any): void => {
                console.log(`remote app ver: ${data}`);
                // if (data !== Number(ver)) {
                //     console.log('new version, reloading...');
                //     alert('Доступно обновление, приложение перезагрузиться');
                //     clearCache();
                // }
            });
        };

        if (navigator.onLine) {
            checkVer();
        }

        window.addEventListener('online', checkVer);

        return () => {
            window.removeEventListener('online', checkVer);
        };
    }, []);

    return (
        // @ts-ignore
        <ErrorBoundary fallback={ErrorFallback as ReactElement}>
            <AppContext.Provider value={contextValue}>
                <div className={css.app} style={appStyle}>
                    {!auth ? (
                        <div className={css.auth}>
                            <input placeholder='PIN' ref={pinInputRef} type='number' />
                            <button onClick={tryAuth}>ВОЙТИ</button>
                        </div>
                    ) : (
                        <SwipeableViews enableMouseEvents index={1}>
                            <Left1Screen />
                            <MainScreen />
                            <Right1Screen />
                        </SwipeableViews>
                    )}
                </div>
            </AppContext.Provider>
        </ErrorBoundary>
    );
};

// eslint-disable-next-line import/no-default-export
export default App;
