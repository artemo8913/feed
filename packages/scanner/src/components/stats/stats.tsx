import React, { useContext, useEffect, useState } from 'react';

import { StatsTable } from '~/components/stats/stats-table';
import type { NutritionType } from '~/request-local-db';
import { NUTRITION_TYPE, useLocalStats } from '~/request-local-db';
import { getStatsDates } from '~/lib/date';
import { StatsFilter } from '~/components/stats/stats-filter';
import { ViewContext } from '~/view-context';
import { StatsDatePicker } from '~/components/stats/stats-date-picker';

import style from './stats.module.css';

export enum StatsDateEnum {
    today = 'today',
    yesterday = 'yesterday',
    tomorrow = 'tomorrow'
}

export enum TableType {
    default = 'default',
    predict = 'predict'
}

export const Stats = React.memo(function Stats() {
    const { today, tomorrow, yesterday } = getStatsDates();
    const { error, progress, stats, update } = useLocalStats();
    const { currentView } = useContext(ViewContext);

    const [nutritionType, setNutritionType] = useState<NutritionType>(NUTRITION_TYPE.total);
    const [tableType, setTableType] = useState<TableType>(TableType.default);
    const [statsDate, setStatsDate] = useState<StatsDateEnum>(StatsDateEnum.today);
    const [formattedDate, setFormattedDate] = useState<string>(today);

    useEffect(() => {
        updateStats();
    }, [formattedDate]);

    useEffect(() => {
        if (currentView === 2) {
            updateStats();
        }
    }, [currentView]);

    useEffect(() => {
        if (statsDate === StatsDateEnum.today) {
            setTableType(TableType.default);
            setFormattedDate(today);
        }
        if (statsDate === StatsDateEnum.yesterday) {
            setTableType(TableType.default);
            setFormattedDate(yesterday);
        }
        if (statsDate === StatsDateEnum.tomorrow) {
            setTableType(TableType.predict);
            setFormattedDate(tomorrow);
        }
    }, [statsDate]);

    const updateStats = (): void => {
        void update(formattedDate);
    };

    return (
        <>
            <div className={style.btnWrapper}>
                <StatsFilter feedTypeState={nutritionType} setFeedTypeState={setNutritionType} />
                <StatsDatePicker formattedDate={formattedDate} statsDate={statsDate} setStatsDate={setStatsDate} />
            </div>

            {!progress && stats && (
                <StatsTable
                    onField={stats.onField[nutritionType]}
                    fed={stats.fed[nutritionType]}
                    tableType={tableType}
                />
            )}
            {progress && !error && <div>Загрузка...</div>}
            {error && <div>Что-то пошло не так</div>}
        </>
    );
});
