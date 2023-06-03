import type { TransactionJoined } from '~/db';
import type { FeedStats } from '~/request-local-db/use-local-stats';

export interface LocalStatsHook {
    error: any;
    progress: boolean;
    updated: boolean;
    stats: FeedStats | null;
    update: (string, boolean?) => Promise<any>;
}

export interface LocalLastTransHook {
    error: any;
    progress: boolean;
    transactions: Array<TransactionJoined>;
    update: (limit: number) => Promise<any>;
}
