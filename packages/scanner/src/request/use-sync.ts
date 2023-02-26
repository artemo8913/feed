import { useCallback, useMemo, useState } from 'react';

import { useGetVols } from '~/request/use-get-vols';
import { useSendTrans } from '~/request/use-send-trans';

import type { ApiHook } from './lib';

export const useSync = (baseUrl: string, pin: string | null, setAuth: (auth: boolean) => void): ApiHook => {
    const [error, setError] = useState<any>(null);
    const [updated, setUpdated] = useState<any>(null);
    const [fetching, setFetching] = useState<any>(false);

    const {
        // error: transError,
        fetching: transFetching,
        send: transSend
        // updated: transUpdated
    } = useSendTrans(baseUrl, pin, setAuth);
    const {
        // error: volsError,
        fetching: volsFetching,
        send: volsSend
        // updated: volsUpdated
    } = useGetVols(baseUrl, pin, setAuth);

    const send = useCallback(() => {
        if (transFetching || volsFetching) {
            return;
        }

        setFetching(true);

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new Promise((res, rej) => {
            debugger;
            const success = (): void => {
                setFetching(false);
                setError(null);
                setUpdated(+new Date());
                res(true);
            };

            const error = (err): void => {
                setError(err);
                setFetching(false);
                rej(err);
            };

            try {
                transSend()
                    .then(() => {
                        volsSend().then(success).catch(error);
                    })
                    .catch(error);
            } catch (e) {
                rej(e);
            }
        });
    }, [transFetching, transSend, volsFetching, volsSend]);

    return <ApiHook>useMemo(
        () => ({
            fetching,
            updated,
            error,
            send
        }),
        [error, fetching, send, updated]
    );
};
