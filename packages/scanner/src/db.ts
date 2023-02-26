import dayjs from 'dayjs';
import type { Table } from 'dexie';
import Dexie from 'dexie';
import { ulid } from 'ulid';

export interface Transaction {
    ulid: string;
    vol_id: number;
    amount: number;
    ts: number;
}

export enum FeedType {
    FT1 = 'FT1',
    FT2 = 'FT2'
}

export const FeedWithBalance = new Set([FeedType.FT1, FeedType.FT2]);

export interface Volunteer {
    qr: string;
    id: number;
    name: string;
    nickname: string;
    balance: number;
    is_active: boolean;
    is_blocked: boolean;
    active_from: Date;
    active_to: Date;
    expired: number;
    feed_type: FeedType;
    paid: boolean;
    department: Array<{ name: string }>;
    location: Array<{ name: string }>;
}

const DB_VERSION = 3;

export class MySubClassedDexie extends Dexie {
    transactions!: Table<Transaction>;
    volunteers!: Table<Volunteer>;

    constructor() {
        super('yclins');
        this.version(DB_VERSION).stores({
            transactions: '&&ulid, vol_id, amount, ts',
            volunteers:
                '&qr, *id, name, nickname, balance, is_blocked, is_active, feed_type, paid, active_from, active_to, department, location, expired'
        });
    }
}

export const db = new MySubClassedDexie();

export const addTransaction = async (vol: Volunteer): Promise<any> => {
    const ts = dayjs().unix();
    await db.transactions.add({
        vol_id: vol.id,
        ts,
        amount: 1,
        ulid: ulid(ts)
    });
};

export const dbIncFeed = async (vol: Volunteer): Promise<any> => {
    await db.volunteers
        .where('id')
        .equals(vol.id)
        .modify({
            balance: vol.balance - 1
        });
    return await addTransaction(vol);
};
