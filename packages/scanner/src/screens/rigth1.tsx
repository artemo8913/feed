import cn from 'classnames';

import css from '../app.module.css';
import { Stats } from '../components/stats';

export const Right1Screen = () => {
    return (
        <div className={cn(css.screen, css.right1)}>
            <h1>Статистика</h1>
            <Stats />
        </div>
    );
};
