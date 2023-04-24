// @artemo8913 всё равно не понятна разница между nutritionType и nutritionTypePlanned
export interface humanFeedTypesNumber {
    мясоед: number;
    веган: number;
}

export interface ICurrentAPI {
    /** людей на поле активированных (не отображается) */
    /** @artemo8913 количество запланированных кормёжек согласно кол-ву активированных аккаунтов волонтеров (на поле) с разбивкой на категории людей по предпочтениям */
    nutritionType: humanFeedTypesNumber;
    /** людей на поле (всего по типу питания) */
    /** @artemo8913 количество запланированных кормёжок согласно запланированным датам приезда с разбивкой на категории людей по предпочтениям */
    nutritionTypePlanned: humanFeedTypesNumber;
    /** всего людей на поле активированных (не отображается) */
    /** @artemo8913 количество запланированных кормёжек согласно кол-ву активированных аккаунтов волонтеров (на поле) */
    totalCount: number;
    /** людей на поле (всего) */
    /** @artemo8913 количество запланированных кормёжок согласно запланированным датам приезда */
    totalCountPlanned: number;
    /** @artemo8913 статистические (фактические) данные по кормежкам */
    stats: {
        morning: humanFeedTypesNumber;
        lunch: humanFeedTypesNumber;
        dinner: humanFeedTypesNumber;
        night: humanFeedTypesNumber;
        total: humanFeedTypesNumber;
    };
}

export interface IStatisticsAPI {
    [key: string]: ICurrentAPI;
}

export const apiMock: IStatisticsAPI = {
    '2023-04-24 00:00:00': {
        nutritionType: {
            мясоед: 0,
            веган: 2
        },
        nutritionTypePlanned: {
            мясоед: 0,
            веган: 2
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
                веган: 2,
                мясоед: 2
            }
        }
    },
    '2023-04-25 00:00:00': {
        nutritionType: {
            мясоед: 10,
            веган: 2
        },
        nutritionTypePlanned: {
            мясоед: 10,
            веган: 2
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
