import dayjs from 'dayjs';
import type { FC } from 'react';

import type { Volunteer } from '~/db';

import css from './misc.module.css';

const dateTimeFormat = 'DD MMM HH:mm';

export const LastUpdated: FC<{
    ts: number;
    count: number;
}> = ({ count, ts }) => (
    <div className={css.lastUpdated}>{`Обновлено: ${dayjs(ts).format(dateTimeFormat)} (${count})`}</div>
);

export const VolInfo: FC<{
    vol: Volunteer;
}> = ({ vol: { active_from, active_to, department, location, name, nickname, paid } }) => (
    <div className={css.volInfo}>
        <div className={css.feedType}>{paid ? 'платно' : 'фри'}</div>
        <div>
            <span>
                {name} ({nickname})
            </span>
        </div>
        <div className={css.volDates}>
            {active_from && <span>{`c ${dayjs(active_from).format(dateTimeFormat)}`}</span>}
            {active_to && <span>{`по ${dayjs(active_to).format(dateTimeFormat)}`}</span>}
        </div>
        <div className={css.misc}>
            {department && department.length > 0 && <div>Службы: {department.map(({ name }) => name).join(', ')}</div>}
            {location && location.length > 0 && <div>Локации: {location.map(({ name }) => name).join(', ')}</div>}
        </div>
    </div>
);

export const ErrorMsg: FC<{
    msg: string | Array<string>;
    close: () => void;
}> = ({ close, msg }) => (
    <div className={css.errorMsg}>
        <div>
            {Array.isArray(msg) ? (
                msg.map((m) => (
                    <span key={m}>
                        {m}
                        <br />
                    </span>
                ))
            ) : (
                <span>{msg}</span>
            )}
        </div>
        <div className={css.card}>
            <button type='button' onClick={close}>
                Закрыть
            </button>
        </div>
    </div>
);

export const FeedLeft: FC<{
    msg: string;
}> = ({ msg }) => <div>{msg}</div>;

export const GreenCard: FC<{
    vol: Volunteer;
    doFeed: () => void;
    close: () => void;
}> = ({ close, doFeed, vol }) => (
    <>
        <VolInfo vol={vol} />
        <FeedLeft msg={`Осталось ${vol.balance} кормежек`} />
        <div className={css.card}>
            <button type='button' onClick={doFeed}>
                Кормить
            </button>
            <button type='button' onClick={close}>
                Отмена
            </button>
        </div>
    </>
);

export const RedCard: FC<{
    vol: Volunteer;
    doFeed: () => void;
    close: () => void;
    notice?: string;
}> = ({ close, doFeed, notice, vol }) => (
    <>
        {notice && <h4>{notice}</h4>}
        <VolInfo vol={vol} />
        <FeedLeft msg={`Осталось: ${vol.balance}`} />
        <div className={css.card}>
            <button type='button' onClick={doFeed}>
                Все равно кормить
            </button>
            <button type='button' onClick={close}>
                Отмена
            </button>
        </div>
    </>
);
