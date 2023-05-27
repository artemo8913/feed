import React from 'react';

import type { StatsByMealTime } from '~/request-local-db';
import { TableType } from '~/components/stats';

import style from './stats-table.module.css';

interface StatsTableProps {
    onField: StatsByMealTime;
    fed: StatsByMealTime;
    tableType: TableType;
}

export const StatsTable = ({ fed, onField, tableType }: StatsTableProps) => {
    return (
        <table className={style.table}>
            <thead>
                <tr>
                    <th></th>
                    <th scope='col'>{tableType === TableType.default ? 'Факт' : 'Прогноз'}</th>
                    <th scope='col'>На поле</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope='row'>Завтрак</th>
                    <td>{fed.breakfast}</td>
                    <td>{onField.breakfast}</td>
                </tr>
                <tr>
                    <th scope='row'>Обед</th>
                    <td>{fed.lunch}</td>
                    <td>{onField.lunch}</td>
                </tr>
                <tr>
                    <th scope='row'>Ужин</th>
                    <td>{fed.dinner}</td>
                    <td>{onField.dinner}</td>
                </tr>
                <tr>
                    <th scope='row'>Дожор</th>
                    <td>{fed.night}</td>
                    <td>{onField.night}</td>
                </tr>
            </tbody>
        </table>
    );
};
