import { useState } from 'react';
import dayjs from 'dayjs';

import type { FeedType } from '~/db';
import { getFeedStats, getVolsOnField } from '~/db';
import { breakfast, dinner, lunch, today } from '~/lib/date';
import type { DbQueryHook } from '~/local-db/lib';

export interface IStats {
    breakfast: number;
    lunch: number;
    dinner: number;
}

const onFieldTemp: IStats = {
    breakfast: 0,
    lunch: 0,
    dinner: 0
};

const fedTemp: IStats = {
    breakfast: 0,
    lunch: 0,
    dinner: 0
};

const mealTime = {
    breakfast,
    lunch,
    dinner
};

export const useGetLocalStats = (): DbQueryHook => {
    const [error, setError] = useState<any>(null);
    const [onField, setOnField] = useState<IStats | null>(onFieldTemp);
    const [fed, setFed] = useState<IStats | null>(fedTemp);
    const [progress, setProgress] = useState<any>(false);

    const get = (feedType?: FeedType) => {
        console.log('request');
        setProgress(true);
        const onFieldPromises = Object.keys(onFieldTemp).map(async (key, i) => {
            const date = Object.entries(mealTime)[i][1].toDate();
            await getVolsOnField(date, feedType).then((vols) => {
                onFieldTemp[key] = vols.length;
            });
        });

        const fedPromises = Object.keys(fedTemp).map(async (key, i) => {
            const dateFrom = i > 0 ? Object.entries(mealTime)[i - 1][1].toDate() : dayjs(today).toDate();
            const dateTo = Object.entries(mealTime)[i][1].toDate();
            await getFeedStats(dateFrom, dateTo, feedType).then((vols) => {
                fedTemp[key] = vols.length;
            });
        });

        return Promise.all([Promise.all(onFieldPromises), Promise.all(fedPromises)])
            .then(() => {
                setOnField(onFieldTemp);
                setFed(fedTemp);
                setProgress(false);
            })
            .catch((e) => {
                setError(e);
            });
    };
    return { progress, get, error, data: { onField, fed } };
};
