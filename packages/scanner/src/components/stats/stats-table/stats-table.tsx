import React from 'react';

import type { IStats } from '~/request-local-db';

import style from './stats-table.module.css';

interface StatsTableProps {
    onField: IStats;
    fed: IStats;
}

export const StatsTable = ({ fed, onField }: StatsTableProps) => {
    return (
        <>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Факт</th>
                        <th>На поле</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Завтрак</td>
                        <td>{fed.breakfast}</td>
                        <td>{onField.breakfast}</td>
                    </tr>
                    <tr>
                        <td>Обед</td>
                        <td>{fed.lunch}</td>
                        <td>{onField.lunch}</td>
                    </tr>
                    <tr>
                        <td>Ужин</td>
                        <td>{fed.dinner}</td>
                        <td>{onField.dinner}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};
