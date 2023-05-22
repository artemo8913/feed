import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { StatsTable } from '~/components/stats/stats-table';
import type { NutritionType } from '~/request-local-db';
import { NUTRITION_TYPE, useLocalStats } from '~/request-local-db';
import { getToday } from '~/lib/date';
import { StatsFilter } from '~/components/stats/stats-filter';

import style from './stats.module.css';

export const Stats = React.memo(function Stats() {
    const { error, fed, onField, progress, update } = useLocalStats(dayjs(getToday()).toDate());
    const [feedTypeState, setFeedTypeState] = useState<NutritionType>(NUTRITION_TYPE.total);

    const updateStats = (): void => {
        void update();
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
            {!progress && onField && fed && <StatsTable onField={onField[feedTypeState]} fed={fed[feedTypeState]} />}
            {progress && !error && <div>Загрузка...</div>}
            {error && <div>Что-то пошло не так</div>}
        </>
    );
});
