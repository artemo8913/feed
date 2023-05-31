import { useState } from 'react';
import dayjs from 'dayjs';

import { FeedType, getFeedStats, getVolsOnField, MealTime } from '~/db';
import type { LocalStatsHook } from '~/request-local-db/lib';

export const MEAL_TIME = {
    [MealTime.breakfast]: MealTime.breakfast,
    [MealTime.lunch]: MealTime.lunch,
    [MealTime.dinner]: MealTime.dinner,
    [MealTime.night]: MealTime.night
} as const;

type StatsByNutritionType = {
    NT1: number;
    NT2: number;
    total: number;
};

type FeedStatsRecord = Record<MealTime, StatsByNutritionType>;
export type FeedStats = { onField: FeedStatsRecord; fed: FeedStatsRecord };

export const useLocalStats = (): LocalStatsHook => {
    const [error, setError] = useState<any>(null);
    const [stats, setStats] = useState<FeedStats | null>(null);
    const [progress, setProgress] = useState<boolean>(false);
    const [updated, setUpdated] = useState<boolean>(false);

    const update = (statsDate: string) => {
        const onFieldTemp: FeedStatsRecord = <FeedStatsRecord>{};
        const fedTemp: FeedStatsRecord = <FeedStatsRecord>{};

        setUpdated(false);
        setProgress(true);

        const onFieldPromises = Object.keys(MEAL_TIME).map(async (key) => {
            await getVolsOnField(statsDate).then((vols) => {
                if (MEAL_TIME[key] === MEAL_TIME.breakfast) {
                    vols = vols.filter(
                        (vol) => !!vol.active_from && dayjs(vol.active_from).unix() < dayjs(statsDate).unix()
                    );
                }
                if (MEAL_TIME[key] === MEAL_TIME.dinner) {
                    vols = vols.filter(
                        (vol) => !!vol.active_to && dayjs(vol.active_to).unix() > dayjs(statsDate).unix()
                    );
                }
                if (MEAL_TIME[key] === MEAL_TIME.night) {
                    vols = vols.filter(
                        (vol) =>
                            !!vol.active_to &&
                            dayjs(vol.active_to).unix() > dayjs(statsDate).unix() &&
                            vol.feed_type !== FeedType.FT2
                    );
                }
                const nt1 = vols.filter((vol) => !vol.is_vegan).length;
                const nt2 = vols.filter((vol) => vol.is_vegan).length;
                const total = vols.length;

                onFieldTemp[MEAL_TIME[key]] = {
                    NT1: nt1,
                    NT2: nt2,
                    total: total
                };
            });
        });

        const fedPromises = Object.keys(MEAL_TIME).map(async (key) => {
            await getFeedStats(statsDate).then((txs) => {
                if (MEAL_TIME[key] === MEAL_TIME.breakfast) {
                    txs = txs.filter((tx) => tx.mealTime === MealTime.breakfast);
                }
                if (MEAL_TIME[key] === MEAL_TIME.lunch) {
                    txs = txs.filter((tx) => tx.mealTime === MealTime.lunch);
                }
                if (MEAL_TIME[key] === MEAL_TIME.dinner) {
                    txs = txs.filter((tx) => tx.mealTime === MealTime.dinner);
                }
                if (MEAL_TIME[key] === MEAL_TIME.night) {
                    txs = txs.filter((tx) => tx.mealTime === MealTime.night);
                }

                const nt1 = txs.filter((tx) => !tx.is_vegan).length;
                const nt2 = txs.filter((tx) => tx.is_vegan).length;
                const total = txs.length;

                fedTemp[MEAL_TIME[key]] = {
                    NT1: nt1,
                    NT2: nt2,
                    total: total
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
