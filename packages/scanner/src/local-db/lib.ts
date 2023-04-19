export interface DbQueryHook {
    progress: boolean;
    error: any;
    data: any;
    get: (data?: any) => Promise<any>;
}
