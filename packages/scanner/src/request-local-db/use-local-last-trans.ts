import { useState } from 'react';

import type { TransactionJoined } from '~/db';
import { getLastTrans } from '~/db';
import type { LocalLastTransHook } from '~/request-local-db/lib';

export const useLocalLastTrans = (): LocalLastTransHook => {
    const [error, setError] = useState<any>(null);
    const [transactions, setTransactions] = useState<Array<TransactionJoined>>([]);
    const [progress, setProgress] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);

    function update() {
        setProgress(true);
        setUpdated(false);

        return getLastTrans()
            .then((txs) => {
                setTransactions(txs);
                setProgress(false);
                setUpdated(true);
            })
            .catch((e) => {
                setProgress(false);
                setError(e);
                console.error(e);
            });
    }
    return { error, progress, updated, transactions, update };
};
