import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { StatsTable } from '~/components/stats/stats-table';
import { useGetLocalStats } from '~/request-local-db';
import { createMockData } from '~/lib/mock';
import { getToday } from '~/lib/date';

export const Stats = () => {
    const { data, get, progress, updated } = useGetLocalStats(dayjs(getToday()).toDate());
    const [feedTypeState, setFeedTypeState] = useState<'total' | 'FT1' | 'FT2'>('total');

    const updateStats = (): void => {
        void get();
    };

    // const test = () => {
    //     createMockData(10);
    // };
    console.log('render');
    useEffect(() => {
        updateStats();
    }, []);
    return (
        <>
            <button onClick={() => setFeedTypeState('total')}>Всего</button>
            <button onClick={() => setFeedTypeState('FT1')}>🍖</button>
            <button onClick={() => setFeedTypeState('FT2')}>🍃</button>
            <button onClick={updateStats}>Обновить</button>

            {!progress && updated ? (
                <StatsTable onField={data.onField[feedTypeState]} fed={data.fed[feedTypeState]} />
            ) : (
                <div>Loading...</div>
            )}
            {/*<button onClick={test}>Trans</button>*/}
        </>
    );
};
