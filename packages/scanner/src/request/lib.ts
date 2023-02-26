export interface ApiHook {
    fetching: boolean;
    error: any;
    data: any;
    updated: number;
    send: (data?: any) => Promise<any>;
}
