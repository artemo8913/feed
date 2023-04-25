import React from 'react';

import type { IStats } from '~/request-local-db';

import style from './stats-table.module.css';

interface StatsTableProps {
    onField: IStats;
    fed: IStats;
}

export const StatsTable = ({ fed, onField }: StatsTableProps) => {
    return (
        <table className={style.table}>
            <thead>
                <tr>
                    <th></th>
                    <th scope='col'>Факт</th>
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
