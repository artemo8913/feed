import React, { useContext } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import dayjs from 'dayjs';

import { AppContext } from '~/app-context';
import { db } from '~/db';
import { getToday } from '~/lib/date';

import style from './main-screen-stats.module.css';

export const MainScreenStats = () => {
    const { mealTime } = useContext(AppContext);

    const volsOnField = useLiveQuery(
        async () =>
            db.volunteers
                .toCollection()
                .filter((vol) => {
                    return (
                        vol.active_to &&
                        vol.active_from &&
                        vol.active_from <= dayjs().toDate() &&
                        vol.active_to >= dayjs().toDate() &&
                        vol.is_active
                    );
                })
                .count(),
        [mealTime],
        0
    );

    const volsFed = useLiveQuery(
        async () => {
            const today = getToday();
            return db.transactions
                .where('ts')
                .between(dayjs(today).add(7, 'h').unix(), dayjs(today).add(31, 'h').unix())
                .filter((tx) => {
                    return tx.mealTime === mealTime;
                })
                .count();
        },
        [mealTime],
        0
    );
    return (
        <div className={style.mainScreenStats}>
            <span>На поле: {volsOnField}</span>
            <span>Покормлено: {volsFed}</span>
            <span>Осталось: {volsOnField > volsFed ? volsOnField - volsFed : 0}</span>
        </div>
    );
};
