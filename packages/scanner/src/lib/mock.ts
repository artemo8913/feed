import dayjs from 'dayjs';
import { ulid } from 'ulid';

import { rndInt } from './utils';

export interface VolResponse {
    vol_id: number;
    amount: 1;
    ts: number;
    ulid: string;
}

const createTestTrans = (): VolResponse => {
    const rndShift = rndInt(4, 27);
    let ts: any = dayjs().startOf('day').add(rndShift, 'hour');
    ts = ts.unix();

    return {
        vol_id: rndInt(0, 600),
        amount: 1,
        ts,
        ulid: ulid(ts)
    };
};

export const createMockData = (cnt: number): Array<VolResponse> =>
    Array(cnt)
        .fill(0)
        .map(() => createTestTrans());
