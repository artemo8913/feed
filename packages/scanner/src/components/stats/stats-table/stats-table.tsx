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
    const { feedCount, onField } = stats;
    const styleOnLoading = progress ? style.loading : '';

    const StatsRecords = () => {
        const Records = MEAL_TIME.map((MT) => {
            let formattedMealTime: string;
            switch (MT) {
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
                <tr key={MT}>
                    <th scope='row'>{formattedMealTime}</th>
                    <td>
                        <span>{feedCount[MT].total}</span>
                        <div>
                            <span className={style.meat}>{feedCount[MT].NT1}</span>/
                            <span className={style.vegan}>{feedCount[MT].NT2}</span>
                        </div>
                    </td>
                    <td>
                        <span>{onField[MT].total}</span>
                        <div>
                            <span className={style.meat}>{onField[MT].NT1}</span>/
                            <span className={style.vegan}>{onField[MT].NT2}</span>
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
