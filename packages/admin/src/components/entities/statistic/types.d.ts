// Типы и интерфейсы для API
// @artemo8913 всё равно не понятна разница между nutritionType и nutritionTypePlanned
export interface IHumanFeedTypesNumber {
    мясоед: number;
    веган: number;
}

export interface ICurrentAPI {
    /** людей на поле активированных (не отображается) */
    /** @artemo8913 количество запланированных кормёжек согласно кол-ву активированных аккаунтов волонтеров (на поле) с разбивкой на категории людей по предпочтениям */
    nutritionType: IHumanFeedTypesNumber;
    /** людей на поле (всего по типу питания) */
    /** @artemo8913 количество запланированных кормёжок согласно запланированным датам приезда с разбивкой на категории людей по предпочтениям */
    nutritionTypePlanned: {
        morning: IHumanFeedTypesNumber;
        lunch: IHumanFeedTypesNumber;
        dinner: IHumanFeedTypesNumber;
        night: IHumanFeedTypesNumber;
        total: IHumanFeedTypesNumber;
    };
    /** всего людей на поле активированных (не отображается) */
    /** @artemo8913 количество запланированных кормёжек согласно кол-ву активированных аккаунтов волонтеров (на поле) */
    totalCount: number;
    /** людей на поле (всего) */
    /** @artemo8913 количество запланированных кормёжок согласно запланированным датам приезда */
    totalCountPlanned: number;
    /** @artemo8913 статистические (фактические) данные по кормежкам */
    stats: {
        morning: IHumanFeedTypesNumber;
        lunch: IHumanFeedTypesNumber;
        dinner: IHumanFeedTypesNumber;
        night: IHumanFeedTypesNumber;
        total: IHumanFeedTypesNumber;
    };
}

export interface IStatisticsAPI {
    [key: string]: ICurrentAPI;
}

//Типы для данных
export type TypeOfEaters = 'all' | 'meatEaters' | 'vegetarian';
export type StatisticCategoriesRu = 'план' | 'факт';
export type MealTimeEN = 'morning' | 'lunch' | 'dinner' | 'night' | 'total';
export type MealTimeRU = 'завтрак' | 'обед' | 'ужин' | 'дожор' | 'всего';
