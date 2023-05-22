import type { TransactionJoined } from '~/db';
import type { NutritionType } from '~/request-local-db/use-local-stats';

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
    onField: Record<NutritionType, IStats> | object | null;
    fed: Record<NutritionType, IStats> | object | null;
    update: () => Promise<any>;
}

export interface LocalLastTransHook {
    error: any;
    progress: boolean;
    transactions: Array<TransactionJoined>;
    update: (limit: number) => Promise<any>;
}
