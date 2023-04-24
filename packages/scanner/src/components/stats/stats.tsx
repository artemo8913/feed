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
    const { data, get, progress, updated } = useGetLocalStats(dayjs(getToday()).toDate());
    const [feedTypeState, setFeedTypeState] = useState<FeedTypeState>('total');

    const updateStats = (): void => {
        void get();
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
            {!progress && updated ? (
                <StatsTable onField={data.onField[feedTypeState]} fed={data.fed[feedTypeState]} />
            ) : (
                <div>Загрузка...</div>
            )}
            {dev && <button onClick={test}>Create x10 trans</button>}
        </>
    );
};
