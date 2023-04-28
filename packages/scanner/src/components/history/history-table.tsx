import React from 'react';
import dayjs from 'dayjs';

import type { TransactionJoined } from '~/db';

import style from './history.module.css';

interface HistoryListProps {
    transactions: Array<TransactionJoined>;
}

const HistoryTable = ({ transactions }: HistoryListProps) => {
    const txItems = transactions.map((transaction, index) => {
        return (
            <tr key={index}>
                <td>{transaction.vol?.name}</td>
                <td>{dayjs.unix(transaction.ts).format('MM.DD hh:mm').toString()}</td>
            </tr>
        );
    });
    return (
        <table className={style.table}>
            <thead>
                <tr>
                    <th scope='col'>Волонтер</th>
                    <th scope='col'>Время</th>
                </tr>
            </thead>
            <tbody>{txItems}</tbody>
        </table>
    );
};

export default HistoryTable;
