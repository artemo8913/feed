import cn from 'classnames';

import css from '../app.module.css';

export const Left1Screen = () => {
    return (
        <div className={cn(css.screen, css.left1)}>
            <h1>LEFT1</h1>
        </div>
    );
};
