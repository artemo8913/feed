import React from 'react';

import { TableType } from '~/components/stats';
import type { FeedStats } from '~/request-local-db';

import style from './stats-table.module.css';

interface StatsTableProps {
    stats: FeedStats;
    tableType: TableType;
    progress: boolean;
}

export const StatsTable = ({ progress, stats, tableType }: StatsTableProps) => {
    const { fed, onField } = stats;
    const styleOnLoading = progress ? style.loading : '';
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
                <tr>
                    <th scope='row'>Завтрак</th>
                    <td>
                        <span>{fed.total.breakfast}</span>
                        <div>
                            <span className={style.meat}>{fed.NT1.breakfast}</span>/
                            <span className={style.vegan}>{fed.NT2.breakfast}</span>
                        </div>
                    </td>
                    <td>
                        <span>{onField.total.breakfast}</span>
                        <div>
                            <span className={style.meat}>{onField.NT1.breakfast}</span>/
                            <span className={style.vegan}>{onField.NT2.breakfast}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope='row'>Обед</th>
                    <td>
                        <span>{fed.total.lunch}</span>
                        <div>
                            <span className={style.meat}>{fed.NT1.lunch}</span>/
                            <span className={style.vegan}>{fed.NT2.lunch}</span>
                        </div>
                    </td>
                    <td>
                        <span>{onField.total.lunch}</span>
                        <div>
                            <span className={style.meat}>{onField.NT1.lunch}</span>/
                            <span className={style.vegan}>{onField.NT2.lunch}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope='row'>Ужин</th>
                    <td>
                        <span>{fed.total.dinner}</span>
                        <div>
                            <span className={style.meat}>{fed.NT1.dinner}</span>/
                            <span className={style.vegan}>{fed.NT2.dinner}</span>
                        </div>
                    </td>
                    <td>
                        <span>{onField.total.dinner}</span>
                        <div>
                            <span className={style.meat}>{onField.NT1.dinner}</span>/
                            <span className={style.vegan}>{onField.NT2.dinner}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope='row'>Дожор</th>
                    <td>
                        <span>{fed.total.night}</span>
                        <div>
                            <span className={style.meat}>{fed.NT1.night}</span>/
                            <span className={style.vegan}>{fed.NT2.night}</span>
                        </div>
                    </td>
                    <td>
                        <span>{onField.total.night}</span>
                        <div>
                            <span className={style.meat}>{onField.NT1.night}</span>/
                            <span className={style.vegan}>{onField.NT2.night}</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
