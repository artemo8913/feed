import './wdyr';

import type { FC, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';

import './lib/date';

import { ErrorMsg, LastUpdated } from '~/components/misc/misc';
import { PostScan } from '~/components/post-scan';
import { QrScan } from '~/components/qr-scan';

import type { AppColor, IAppContext } from './app-context';
import { AppContext, Colors } from './app-context';
import { API_DOMAIN } from './config';
import { BtnSync } from './components/btn-sync';
import css from './app.module.css';
// import { clearCache } from './lib/utils';
import { db } from './db';
import { useCheckAuth } from './request';

// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved
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
    const [scanResult, setScanResult] = useState('');
    const [appColor, setAppColor] = useState<AppColor | null>(null);
    const [appError, setAppError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdated] = useState<number | null>(null);
    const [volCount, setVolCount] = useState<number>(0);
    const [pin, setPin] = useState<string | null>(storedPin);
    const [auth, setAuth] = useState<boolean>(true);
    const pinInputRef = useRef<HTMLInputElement | null>(null);
    const checkAuth = useCheckAuth(API_DOMAIN, setAuth);
    const appStyle = useMemo(() => ({ backgroundColor: Colors[appColor as AppColor] }), [appColor]);

    const closeFeedDialog = useCallback(() => {
        setAppColor(null);
        setScanResult('');
    }, []);

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
            setColor: setAppColor,
            resetColor: () => setAppColor(null),
            setError: setAppError,
            setLastUpdated: (ts) => {
                localStorage.setItem('lastUpdated', String(ts));
                setLastUpdated(ts);
            },
            setVolCount
        }),
        [pin]
    );

    console.log(scanResult, appError);

    useEffect(() => {
        void db.volunteers.count().then((c) => setVolCount(c));
        setLastUpdated(Number(localStorage.getItem('lastUpdated')));
    }, []);

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
                        <>
                            <BtnSync />
                            {!scanResult && <QrScan onScan={setScanResult} />}
                            {scanResult && <PostScan closeFeed={closeFeedDialog} qrcode={scanResult} />}
                            {appError && <ErrorMsg close={closeFeedDialog} msg={appError} />}
                            <LastUpdated count={volCount} ts={lastUpdate || 0} />
                        </>
                    )}
                </div>
            </AppContext.Provider>
        </ErrorBoundary>
    );
};

// eslint-disable-next-line import/no-default-export
export default App;
