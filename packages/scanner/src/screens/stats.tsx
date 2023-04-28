import cn from 'classnames';

import css from '../app.module.css';
import { Stats } from '../components/stats';

export const StatsScreen = () => {
    return (
        <div className={cn(css.screen, css.stats)}>
            <h2>Статистика</h2>
            <Stats />
        </div>
    );
};
