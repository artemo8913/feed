import React, { useState } from 'react';

import { createMockData } from '~/lib/mock';
import { db } from '~/db';

import style from './mock-trans.module.css';

export const MockTrans: React.FC = () => {
    const [count, setCount] = useState<number>(1);
    const addTestTrans = (count: number, type: 'now' | 'rnd') => {
        const trans = createMockData(count, type);
        trans.forEach((tx) => {
            void db.transactions.add(tx);
        });
    };
    return (
        <div className={style.mockBlock}>
            <input type={'number'} placeholder={'count'} value={count} onChange={(e) => setCount(+e.target.value)} />
            <button onClick={() => addTestTrans(count, 'now')}>Tx now</button>
            <button onClick={() => addTestTrans(count, 'rnd')}>Tx rnd</button>
        </div>
    );
};
