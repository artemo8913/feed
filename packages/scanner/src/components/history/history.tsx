import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { HistoryTable } from '~/components/history/history-table';
import { getLastTrans } from '~/db';

export const History: React.FC = () => {
    const [error, setError] = useState<any>(null);
    const transactions = useLiveQuery(
        () => {
            try {
                return getLastTrans(0);
            } catch (e) {
                setError(e);
                console.error(e);
            }
        },
        [],
        null
    );
    return (
        <>
            {transactions && !error && <HistoryTable transactions={transactions} />}
            {!transactions && <div>Загрузка...</div>}
            {error && <div>Что-то пошло не так</div>}
        </>
    );
};
