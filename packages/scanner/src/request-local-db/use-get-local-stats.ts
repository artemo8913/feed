import { useState } from 'react';
import dayjs from 'dayjs';

import { FeedType, getFeedStats, getVols } from '~/db';
import type { DbQueryHook } from '~/request-local-db/lib';
import { getMealTime } from '~/lib/date';

export interface IStats {
    breakfast: number;
    lunch: number;
    dinner: number;
}

export const useGetLocalStats = (statsDate): DbQueryHook => {
    const [error, setError] = useState<any>(null);
    const [onField, setOnField] = useState<Record<string, IStats> | null>(null);
    const [fed, setFed] = useState<Record<string, IStats> | null>(null);
    const [progress, setProgress] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);

    const get = () => {
        const mealTime = getMealTime();

        const onFieldTemp: Record<string, IStats> = {};
        const fedTemp: Record<string, IStats> = {};

        setUpdated(false);
        setProgress(true);

        const onFieldPromises = Object.keys(FeedType).map(async (key) => {
            await getVols(statsDate, FeedType[key]).then((vols) => {
                const breakfast = vols.filter(
                    (vol) =>
                        vol.active_to > mealTime.breakfast.toDate() && vol.active_from < mealTime.breakfast.toDate()
                ).length;
                const lunch = vols.filter(
                    (vol) => vol.active_to > mealTime.lunch.toDate() && vol.active_from < mealTime.lunch.toDate()
                ).length;
                const dinner = vols.filter(
                    (vol) => vol.active_to > mealTime.dinner.toDate() && vol.active_from < mealTime.dinner.toDate()
                ).length;

                onFieldTemp[FeedType[key]] = {
                    breakfast,
                    lunch,
                    dinner
                };
            });
        });

        const onFieldTotalPromise = Promise.all(onFieldPromises).then(() => {
            const total = {
                breakfast: 0,
                lunch: 0,
                dinner: 0
            };

            Object.values(onFieldTemp).forEach((stats) => {
                Object.keys(total).forEach((key) => {
                    total[key] += stats[key];
                });
            });
            onFieldTemp['total'] = total;
        });

        const fedPromises = Object.keys(FeedType).map(async (key) => {
            await getFeedStats(statsDate, FeedType[key]).then((txs) => {
                const breakfast = txs.filter(
                    (tx) => tx.vol && tx.ts > dayjs(statsDate).unix() && tx.ts < mealTime.breakfast.unix()
                ).length;
                const lunch = txs.filter(
                    (tx) => tx.vol && tx.ts > mealTime.breakfast.unix() && tx.ts < mealTime.lunch.unix()
                ).length;
                const dinner = txs.filter(
                    (tx) => tx.vol && tx.ts > mealTime.lunch.unix() && tx.ts < mealTime.dinner.unix()
                ).length;
                fedTemp[FeedType[key]] = {
                    breakfast,
                    lunch,
                    dinner
                };
            });
        });

        const onFedTotalPromise = Promise.all(fedPromises).then(() => {
            const total = {
                breakfast: 0,
                lunch: 0,
                dinner: 0
            };

            Object.values(fedTemp).forEach((stats) => {
                Object.keys(total).forEach((key) => {
                    total[key] += stats[key];
                });
            });
            fedTemp['total'] = total;
        });

        return Promise.all([onFieldTotalPromise, onFedTotalPromise])
            .then(() => {
                setOnField(onFieldTemp);
                setFed(fedTemp);
                setProgress(false);
                setUpdated(true);
            })
            .catch((e) => {
                setError(e);
            });
    };
    return { progress, get, error, updated, data: { onField, fed } };
};
