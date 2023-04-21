export interface DbQueryHook {
    progress: boolean;
    updated: boolean;
    error: any;
    data: any;
    get: (data?: any) => Promise<any>;
}
