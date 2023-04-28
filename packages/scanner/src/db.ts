import dayjs from 'dayjs';
import type { Collection, Table } from 'dexie';
import Dexie from 'dexie';
import { ulid } from 'ulid';

export interface Transaction {
    ulid: string;
    vol_id: number;
    amount: number;
    ts: number;
}

export interface TransactionJoined extends Transaction {
    vol?: Volunteer;
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

export async function getVolsOnField(statsDate: Date, feedType?: FeedType): Promise<Array<Volunteer>> {
    if (feedType) {
        return db.volunteers
            .where('feed_type')
            .equals(feedType)
            .filter((vol) => {
                return (
                    vol.active_to &&
                    vol.active_from &&
                    vol.active_from <= dayjs(statsDate).add(1, 'd').toDate() &&
                    vol.active_to >= statsDate
                );
            })
            .filter((vol) => {
                return vol.active_from < statsDate ? vol.is_active : vol.paid ? vol.is_active : true;
            })
            .toArray();
    } else {
        return db.volunteers
            .toCollection()
            .filter((vol) => {
                return (
                    vol.active_to &&
                    vol.active_from &&
                    vol.active_from <= dayjs(statsDate).add(1, 'd').toDate() &&
                    vol.active_to >= statsDate
                );
            })
            .filter((vol) => {
                return vol.active_from < statsDate ? vol.is_active : vol.paid ? vol.is_active : true;
            })
            .toArray();
    }
}

export async function getFeedStats(statsDate: Date, feedType?: FeedType): Promise<Array<TransactionJoined>> {
    const txs = db.transactions.where('ts').between(dayjs(statsDate).unix(), dayjs(statsDate).add(31, 'h').unix());

    if (feedType) {
        return joinTxs(txs).then((txs) =>
            txs.filter((tx) => {
                return tx.vol && tx.vol.feed_type === feedType;
            })
        );
    } else {
        return joinTxs(txs);
    }
}

export async function getLastTrans(): Promise<Array<TransactionJoined>> {
    const txs = db.transactions.where('ts').between(dayjs().subtract(20, 'm').unix(), dayjs().unix());
    return joinTxs(txs);
}
