import dayjs from 'dayjs';
import type { Collection, Table } from 'dexie';
import Dexie from 'dexie';
import { ulid } from 'ulid';

export interface Transaction {
    ulid: string;
    vol_id: number;
    amount: number;
    ts: number;
    mealTime: MealTime;
    is_new: boolean;
}

export interface ServerTransaction {
    ulid: string;
    volunteer: number;
    amount: number;
    dtime: string;
    meal_time: MealTime;
}

export interface TransactionJoined extends Transaction {
    vol?: Volunteer;
}

export enum FeedType {
    FT1 = 1,
    FT2 = 2
}

export enum MealTime {
    breakfast = 'breakfast',
    lunch = 'lunch',
    dinner = 'dinner',
    night = 'night'
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
    is_vegan: boolean;
    active_from: string | null;
    active_to: string | null;
    feed_type: FeedType;
    departments: Array<{ name: string }>;
    kitchen: number;
}

const DB_VERSION = 8;

export class MySubClassedDexie extends Dexie {
    transactions!: Table<Transaction>;
    volunteers!: Table<Volunteer>;

    constructor() {
        super('yclins');
        this.version(DB_VERSION).stores({
            transactions: '&&ulid, vol_id, amount, ts, mealTime, is_new',
            volunteers:
                '&qr, *id, name, nickname, balance, is_blocked, is_active, is_vegan, feed_type, active_from, active_to, departments, location, kitchen'
        });
    }
}

export const db = new MySubClassedDexie();

export const addTransaction = async (vol: Volunteer, mealTime: MealTime): Promise<any> => {
    const ts = dayjs().unix();
    debugger;
    await db.transactions.add({
        vol_id: vol.id,
        ts,
        amount: 1,
        ulid: ulid(ts),
        mealTime: MealTime[mealTime],
        is_new: true
    });
};

export const dbIncFeed = async (vol: Volunteer, mealTime: MealTime): Promise<any> => {
    await db.volunteers
        .where('id')
        .equals(vol.id)
        .modify({
            balance: vol.balance - 1
        });
    return await addTransaction(vol, mealTime);
};

export function joinTxs(txsCollection: Collection<TransactionJoined>): Promise<Array<TransactionJoined>> {
    return txsCollection.toArray((transactions: Array<TransactionJoined>) => {
        const volsPromises = transactions.map((transaction) => {
            return db.volunteers.get({ id: transaction.vol_id });
        });

        return Dexie.Promise.all(volsPromises).then((vols) => {
            transactions.forEach((transaction: TransactionJoined, i) => {
                transaction.vol = vols[i];
            });
            return transactions;
        });
    });
}

export function getVolsOnField(statsDate: Date): Promise<Array<Volunteer>> {
    const kitchenId = localStorage.getItem('kitchenId');
    return db.volunteers
        .filter((vol) => {
            return (
                vol.kitchen.toString() === kitchenId &&
                !!vol.active_to &&
                !!vol.active_from &&
                dayjs(vol.active_from).unix() <= dayjs(statsDate).add(1, 'd').unix() &&
                dayjs(vol.active_to).unix() >= dayjs(statsDate).unix() &&
                (dayjs(vol.active_from).unix() < dayjs(statsDate).unix()
                    ? vol.is_active
                    : vol.feed_type === FeedType.FT2
                    ? vol.is_active
                    : true)
            );
        })
        .toArray();
}

export function getFeedStats(statsDate: Date): Promise<Array<TransactionJoined>> {
    const txs = db.transactions.where('ts').between(dayjs(statsDate).unix(), dayjs(statsDate).add(31, 'h').unix());
    return joinTxs(txs);
}

export function getLastTrans(offset: number, limit: number): Promise<Array<TransactionJoined>> {
    const txs = db.transactions
        .where('ts')
        .above(dayjs().subtract(20, 'm').unix())
        .reverse()
        .offset(offset)
        .limit(limit);
    return joinTxs(txs);
}
