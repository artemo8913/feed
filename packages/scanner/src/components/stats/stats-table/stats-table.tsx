import React, { useEffect } from 'react';

import { useGetLocalStats } from '~/local-db';
import { today } from '~/lib/date';

import style from './stats-table.module.css';

export const StatsTable = () => {
    const { data, get, progress } = useGetLocalStats();
    console.log('render');
    useEffect(() => {
        void get();
    }, []);
    return (
        <>
            {!progress ? (
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
                            <td>{data.fed.breakfast}</td>
                            <td>{data.onField.breakfast}</td>
                        </tr>
                        <tr>
                            <td>Обед</td>
                            <td>{data.fed.lunch}</td>
                            <td>{data.onField.lunch}</td>
                        </tr>
                        <tr>
                            <td>Ужин</td>
                            <td>{data.fed.dinner}</td>
                            <td>{data.onField.dinner}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <div> Loading </div>
            )}
            <span>Today: {today}</span>
            <button onClick={() => void get()}>Update</button>
        </>
    );
};
