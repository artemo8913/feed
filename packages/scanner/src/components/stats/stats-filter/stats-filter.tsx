import React from 'react';

import type { FeedTypeState } from '~/components/stats';

import style from './stats-filter.module.css';

interface StatsFilterProps {
    feedTypeState: FeedTypeState;
    setFeedTypeState: (any) => void;
}

type ButtonsData = {
    name: FeedTypeState;
    label: string;
};

export const StatsFilter = ({ feedTypeState, setFeedTypeState }: StatsFilterProps) => {
    const buttonsData: Array<ButtonsData> = [
        { name: 'total', label: 'Всего' },
        { name: 'FT1', label: '🍖' },
        { name: 'FT2', label: '🍃' }
    ];

    const buttons = buttonsData.map(({ label, name }) => {
        const active = feedTypeState === name;
        return (
            <>
                <input type='radio' className={style.radio} name={'feedType'} id={name} value={name} key={name} />
                <label
                    htmlFor={name}
                    onClick={() => setFeedTypeState(name)}
                    className={active ? `${style.active} ${style.label}` : style.label}
                >
                    {label}
                </label>
            </>
        );
    });

    return (
        <>
            <div className={style.btnGroup}>{buttons}</div>
        </>
    );
};

export default StatsFilter;
