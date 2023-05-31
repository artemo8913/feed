import React from 'react';

import { TableType } from '~/components/stats';
import type { FeedStats } from '~/request-local-db';
import { MEAL_TIME } from '~/request-local-db';

import style from './stats-table.module.css';

interface StatsTableProps {
    stats: FeedStats;
    tableType: TableType;
    progress: boolean;
}

export const StatsTable = ({ progress, stats, tableType }: StatsTableProps) => {
    const { fed, onField } = stats;
    const styleOnLoading = progress ? style.loading : '';

    const StatsRecords = () => {
        const Records = Object.keys(MEAL_TIME).map((key) => {
            let formattedMealTime: string;
            switch (key) {
                case 'breakfast':
                    formattedMealTime = 'Завтрак';
                    break;
                case 'lunch':
                    formattedMealTime = 'Обед';
                    break;
                case 'dinner':
                    formattedMealTime = 'Ужин';
                    break;
                case 'night':
                    formattedMealTime = 'Дожор';
                    break;
                default:
                    formattedMealTime = '';
            }
            return (
                <tr key={key}>
                    <th scope='row'>{formattedMealTime}</th>
                    <td>
                        <span>{fed[MEAL_TIME[key]].total}</span>
                        <div>
                            <span className={style.meat}>{fed[MEAL_TIME[key]].NT1}</span>/
                            <span className={style.vegan}>{fed[MEAL_TIME[key]].NT2}</span>
                        </div>
                    </td>
                    <td>
                        <span>{onField[MEAL_TIME[key]].total}</span>
                        <div>
                            <span className={style.meat}>{onField[MEAL_TIME[key]].NT1}</span>/
                            <span className={style.vegan}>{onField[MEAL_TIME[key]].NT2}</span>
                        </div>
                    </td>
                </tr>
            );
        });
        return <>{Records}</>;
    };

    return (
        <table className={`${style.table} ${styleOnLoading}`}>
            <thead>
                <tr>
                    <th></th>
                    <th scope='col'>{tableType === TableType.default ? 'Факт' : 'Прогноз'}</th>
                    <th scope='col'>На поле</th>
                </tr>
            </thead>
            <tbody>
                <StatsRecords />
            </tbody>
        </table>
    );
};
