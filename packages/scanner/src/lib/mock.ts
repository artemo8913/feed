import dayjs from 'dayjs';
import { ulid } from 'ulid';

import { MealTime } from '~/db';

import { rndInt } from './utils';

export interface VolResponse {
    vol_id: number;
    amount: 1;
    ts: number;
    ulid: string;
    mealTime: MealTime;
}

const createTestTrans = (type: 'now' | 'rnd'): VolResponse => {
    let ts: any;
    if (type === 'now') {
        ts = dayjs();
    }
    if (type === 'rnd') {
        ts = dayjs().startOf('day').add(rndInt(7, 31), 'h');
    }
    ts = ts.unix();

    return {
        vol_id: rndInt(0, 600),
        amount: 1,
        ts,
        ulid: ulid(ts),
        mealTime: MealTime.breakfast
    };
};

export const createMockData = (cnt: number, type: 'now' | 'rnd'): Array<VolResponse> =>
    Array(cnt)
        .fill(0)
        .map(() => createTestTrans(type));
