export interface IStats {
    breakfast: number;
    lunch: number;
    dinner: number;
    night: number;
}

export interface GetLocalStatsHook {
    error: any;
    progress: boolean;
    updated: boolean;
    onField: Record<string, IStats>;
    fed: Record<string, IStats>;
    update: (data?: any) => Promise<any>;
}
