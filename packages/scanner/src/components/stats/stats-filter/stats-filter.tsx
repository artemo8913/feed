import React from 'react';

import type { NutritionType } from '~/request-local-db';
import { NUTRITION_TYPE } from '~/request-local-db';

import style from './stats-filter.module.css';

interface StatsFilterProps {
    feedTypeState: NutritionType;
    setFeedTypeState: (any) => void;
}

type ButtonsData = {
    name: NutritionType;
    label: string;
};

export const StatsFilter = ({ feedTypeState, setFeedTypeState }: StatsFilterProps) => {
    const buttonsData: Array<ButtonsData> = [
        { name: NUTRITION_TYPE.total, label: 'Всего' },
        { name: NUTRITION_TYPE.NT1, label: '🍖' },
        { name: NUTRITION_TYPE.NT2, label: '🍃' }
    ];

    const buttons = buttonsData.map(({ label, name }) => {
        const active = feedTypeState === name;
        return (
            <div className={style.radioWrapper} key={name}>
                <input
                    type='radio'
                    className={style.radio}
                    name={'feedType'}
                    id={name}
                    value={name}
                    onChange={() => setFeedTypeState(name)}
                    checked={feedTypeState === name}
                />
                <label htmlFor={name} className={active ? `${style.active} ${style.label}` : style.label}>
                    {label}
                </label>
            </div>
        );
    });

    return (
        <>
            <div className={style.btnGroup}>{buttons}</div>
        </>
    );
};

export default StatsFilter;
