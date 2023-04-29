import cn from 'classnames';

import { History } from '~/components/history';

import css from '../app.module.css';

export const HistoryScreen = () => {
    return (
        <div className={cn(css.screen, css.history)}>
            <h2>История</h2>
            <History />
        </div>
    );
};
