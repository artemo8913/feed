import { useState } from 'react';
import dayjs from 'dayjs';

import { FeedType, getFeedStats, getVolsOnField, MealTime } from '~/db';
import type { LocalStatsHook } from '~/request-local-db/lib';
import type { ValueOf } from '~/components/misc';

export const NUTRITION_TYPE = {
    NT1: 'NT1',
    NT2: 'NT2',
    total: 'total'
} as const;
export type NutritionType = ValueOf<typeof NUTRITION_TYPE>;

export type StatsByMealTime = {
    breakfast: number;
    lunch: number;
    dinner: number;
    night: number;
};
export type FeedStatsRecord = Record<NutritionType, StatsByMealTime>;
export type FeedStats = { onField: FeedStatsRecord; fed: FeedStatsRecord };

export const useLocalStats = (): LocalStatsHook => {
    const onFieldTemp: FeedStatsRecord = <FeedStatsRecord>{};
    const fedTemp: FeedStatsRecord = <FeedStatsRecord>{};

    const [error, setError] = useState<any>(null);
    const [stats, setStats] = useState<FeedStats | null>(null);
    const [progress, setProgress] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);

    const update = (statsDate) => {
        setUpdated(false);
        setProgress(true);

        const onFieldPromises = Object.keys(NUTRITION_TYPE).map(async (key) => {
            await getVolsOnField(statsDate).then((vols) => {
                if (NUTRITION_TYPE[key] === NUTRITION_TYPE.NT1) {
                    vols = vols.filter((vol) => !vol.is_vegan);
                }
                if (NUTRITION_TYPE[key] === NUTRITION_TYPE.NT2) {
                    vols = vols.filter((vol) => vol.is_vegan);
                }

                const breakfast = vols.filter(
                    (vol) => !!vol.active_from && dayjs(vol.active_from).unix() < dayjs(statsDate).unix()
                ).length;
                const lunch = vols.length;
                const dinner = vols.filter(
                    (vol) => !!vol.active_to && dayjs(vol.active_to).unix() > dayjs(statsDate).unix()
                ).length;
                const night = vols.filter(
                    (vol) =>
                        !!vol.active_to &&
                        dayjs(vol.active_to).unix() > dayjs(statsDate).unix() &&
                        vol.feed_type !== FeedType.FT2
                ).length;

                onFieldTemp[NUTRITION_TYPE[key]] = {
                    breakfast,
                    lunch,
                    dinner,
                    night
                };
            });
        });

        const fedPromises = Object.keys(NUTRITION_TYPE).map(async (key) => {
            await getFeedStats(statsDate).then((txs) => {
                if (NUTRITION_TYPE[key] === NUTRITION_TYPE.NT1) {
                    txs = txs.filter((tx) => !tx.vol?.is_vegan);
                }
                if (NUTRITION_TYPE[key] === NUTRITION_TYPE.NT2) {
                    txs = txs.filter((tx) => tx.vol?.is_vegan);
                }

                const breakfast = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.breakfast).length;
                const lunch = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.lunch).length;
                const dinner = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.dinner).length;
                const night = txs.filter((tx) => tx.vol && tx.mealTime === MealTime.night).length;

                fedTemp[NUTRITION_TYPE[key]] = {
                    breakfast,
                    lunch,
                    dinner,
                    night
                };
            });
        });

        return Promise.all([...onFieldPromises, ...fedPromises])
            .then(() => {
                setStats({
                    onField: onFieldTemp,
                    fed: fedTemp
                });
                setProgress(false);
                setUpdated(true);
            })
            .catch((e) => {
                setError(e);
                setProgress(false);
                console.error(e);
            });
    };
    return { progress, update, error, updated, stats };
};
