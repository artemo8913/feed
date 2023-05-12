import { useState } from 'react';

import { FeedType, getFeedStats, getVolsOnField, MealTime } from '~/db';
import type { IStats, LocalStatsHook } from '~/request-local-db/lib';

export const useLocalStats = (statsDate): LocalStatsHook => {
    const onFieldTemp: Record<string, IStats> = {};
    const fedTemp: Record<string, IStats> = {};

    const [error, setError] = useState<any>(null);
    const [onField, setOnField] = useState<Record<string, IStats>>(onFieldTemp);
    const [fed, setFed] = useState<Record<string, IStats>>(fedTemp);
    const [progress, setProgress] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);

    const update = () => {
        setUpdated(false);
        setProgress(true);

        const onFieldPromises = Object.keys(FeedType).map(async (key) => {
            await getVolsOnField(statsDate, FeedType[key]).then((vols) => {
                const breakfast = vols.filter((vol) => vol.active_from < statsDate).length;
                const lunch = vols.length;
                const dinner = vols.length;
                const night = vols.filter((vol) => !vol.paid).length;

                onFieldTemp[FeedType[key]] = {
                    breakfast,
                    lunch,
                    dinner,
                    night
                };
            });
        });

        const onFieldTotalPromise = Promise.all(onFieldPromises).then(() => {
            const total = {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                night: 0
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
                const breakfast = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.breakfast).length;
                const lunch = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.lunch).length;
                const dinner = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.dinner).length;
                const night = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.night).length;
                fedTemp[FeedType[key]] = {
                    breakfast,
                    lunch,
                    dinner,
                    night
                };
            });
        });

        const onFedTotalPromise = Promise.all(fedPromises).then(() => {
            const total = {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                night: 0
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
                console.error(e);
            });
    };
    return { progress, update, error, updated, onField, fed };
};
