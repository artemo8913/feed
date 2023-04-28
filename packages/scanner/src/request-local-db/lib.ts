import type { TransactionJoined } from '~/db';

export interface IStats {
    breakfast: number;
    lunch: number;
    dinner: number;
    night: number;
}

export interface LocalStatsHook {
    error: any;
    progress: boolean;
    updated: boolean;
    onField: Record<string, IStats>;
    fed: Record<string, IStats>;
    update: () => Promise<any>;
}

export interface LocalLastTransHook {
    error: any;
    progress: boolean;
    updated: boolean;
    transactions: Array<TransactionJoined>;
    update: () => Promise<any>;
}
