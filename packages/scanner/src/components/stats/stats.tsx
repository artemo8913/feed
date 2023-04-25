import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { StatsTable } from '~/components/stats/stats-table';
import { useGetLocalStats } from '~/request-local-db';
import { createMockData } from '~/lib/mock';
import { getToday } from '~/lib/date';
import { StatsFilter } from '~/components/stats/stats-filter';
import { db } from '~/db';

import style from './stats.module.css';

export type FeedTypeState = 'total' | 'FT1' | 'FT2';

const dev = process.env.NODE_ENV !== 'production';

export const Stats = () => {
    const { error, fed, onField, progress, update, updated } = useGetLocalStats(dayjs(getToday()).toDate());
    const [feedTypeState, setFeedTypeState] = useState<FeedTypeState>('total');

    const updateStats = (): void => {
        void update();
    };

    const test = () => {
        const trans = createMockData(10);
        const txPromises = trans.map((tx) => {
            void db.transactions.add(tx);
        });
        void Promise.all(txPromises).then(() => {
            updateStats();
        });
    };
    useEffect(() => {
        updateStats();
    }, []);
    return (
        <>
            <div className={style.btnWrapper}>
                <StatsFilter feedTypeState={feedTypeState} setFeedTypeState={setFeedTypeState} />
                <button type='button' className={style.reloadBtn} onClick={updateStats} disabled={progress}>
                    Обновить
                </button>
            </div>
            {updated && <StatsTable onField={onField[feedTypeState]} fed={fed[feedTypeState]} />}
            {progress && !error && <div>Загрузка...</div>}
            {error && <div>Что-то пошло не так</div>}

            {dev && <button onClick={test}>Create x10 trans</button>}
        </>
    );
};
