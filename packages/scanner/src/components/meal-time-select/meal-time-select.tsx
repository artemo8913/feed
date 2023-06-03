import React, { useContext } from 'react';

import { MealTime } from '~/db';
import { AppContext } from '~/app-context';

import style from './meal-time-select.module.css';

export const MealTimeSelect = () => {
    const { setMealTime } = useContext(AppContext);
    return (
        <div className={style.mealTimeSelectBlock}>
            <h1>Чем кормим?</h1>
            <button onClick={() => setMealTime(MealTime.breakfast)}>Завтрак</button>
            <button onClick={() => setMealTime(MealTime.lunch)}>Обед</button>
            <button onClick={() => setMealTime(MealTime.dinner)}>Ужин</button>
            <button onClick={() => setMealTime(MealTime.night)}>Дожор</button>
        </div>
    );
};
