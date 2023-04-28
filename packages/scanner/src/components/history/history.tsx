import React, { useEffect } from 'react';

import { useLocalLastTrans } from '~/request-local-db';
import HistoryTable from '~/components/history/history-table';

export const History = () => {
    const { error, progress, transactions, update, updated } = useLocalLastTrans();
    useEffect(() => {
        void update();
    }, []);
    return (
        <>
            {updated && <HistoryTable transactions={transactions} />}
            {progress && !error && <div>Загрузка...</div>}
            {error && <div>Что-то пошло не так</div>}
        </>
    );
};
