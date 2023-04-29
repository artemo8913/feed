import { IStatisticsAPI } from "../types";

export const apiMock: IStatisticsAPI = {
    '2023-04-24 00:00:00': {
        nutritionType: {
            мясоед: 0,
            веган: 2
        },
        nutritionTypePlanned: {
            morning: {
                мясоед: 0,
                веган: 0
            },
            lunch: {
                мясоед: 0,
                веган: 0
            },
            dinner: {
                мясоед: 0,
                веган: 0
            },
            night: {
                мясоед: 0,
                веган: 0
            },
            total: {
                веган: 0,
                мясоед: 0
            }
        },
        totalCount: 0,
        totalCountPlanned: 0,
        stats: {
            morning: {
                мясоед: 0,
                веган: 2
            },
            lunch: {
                мясоед: 0,
                веган: 2
            },
            dinner: {
                мясоед: 0,
                веган: 2
            },
            night: {
                мясоед: 0,
                веган: 2
            },
            total: {
                веган: 0,
                мясоед: 8
            }
        }
    },
    '2023-04-25 00:00:00': {
        nutritionType: {
            мясоед: 10,
            веган: 2
        },
        nutritionTypePlanned: {
            morning: {
                мясоед: 1,
                веган: 1
            },
            lunch: {
                мясоед: 1,
                веган: 1
            },
            dinner: {
                мясоед: 1,
                веган: 1
            },
            night: {
                мясоед: 1,
                веган: 1
            },
            total: {
                веган: 4,
                мясоед: 4
            }
        },
        totalCount: 10,
        totalCountPlanned: 2,
        stats: {
            morning: {
                мясоед: 1,
                веган: 1
            },
            lunch: {
                мясоед: 2,
                веган: 2
            },
            dinner: {
                мясоед: 2,
                веган: 2
            },
            night: {
                мясоед: 0,
                веган: 0
            },
            total: {
                веган: 5,
                мясоед: 5
            }
        }
    }
};
