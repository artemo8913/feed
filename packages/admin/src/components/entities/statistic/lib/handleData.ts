import { ICurrentAPI, IHumanFeedTypesNumber, IStatisticsAPI, MealTimeEN, MealTimeRU, TypeOfEaters } from '../types';
import { IColumnChartData } from '../ui/ColumnChart';
import { ILinearChartData } from '../ui/LinearChart';
import { TableStatDataType } from '../ui/TableStats';

// Массивы с наименованием приемов пищи для перебора значений
const mealTimesEnArr: Readonly<MealTimeEN[]> = ['morning', 'lunch', 'dinner', 'night'];
const mealTimeRuObj: { [key in MealTimeEN]: MealTimeRU } = {
    morning: 'завтрак',
    lunch: 'обед',
    dinner: 'ужин',
    night: 'дожор',
    total: 'всего'
};

//Функции для обработки данных
/** Найти в зависимости от типа питания человека план / факт питания. Применяется при поиске для каждого приема пищи (завтра, обед т.д.)*/
function findValuesForTypeEaters(
    resPlan: IHumanFeedTypesNumber,
    resFact: IHumanFeedTypesNumber,
    typeOfEater: TypeOfEaters
): { planValue: number; factValue: number } {
    const shallowCopy = { planValue: 0, factValue: 0 };
    if (typeOfEater === 'all') {
        shallowCopy.planValue = resPlan['веган'] + resPlan['мясоед'];
        shallowCopy.factValue = resFact['веган'] + resFact['мясоед'];
    } else if (typeOfEater === 'meatEaters') {
        shallowCopy.planValue = resPlan['мясоед'];
        shallowCopy.factValue = resFact['мясоед'];
    } else if (typeOfEater === 'vegetarian') {
        shallowCopy.planValue = resPlan['веган'];
        shallowCopy.factValue = resFact['веган'];
    }
    return shallowCopy;
}
/**Преобразование данных от сервера для сравнительной сводной таблицы*/
export function handleDataForTable(res: ICurrentAPI, typeOfEater: TypeOfEaters): TableStatDataType[] {
    if (!res) {
        return [];
    }
    const statsPlan: { [key in MealTimeEN]: number } = { morning: 0, lunch: 0, dinner: 0, night: 0, total: 0 };
    const statsFact: { [key in MealTimeEN]: number } = { morning: 0, lunch: 0, dinner: 0, night: 0, total: 0 };
    for (let mealTime of mealTimesEnArr) {
        const resPlan = res.nutritionTypePlanned[mealTime];
        const resFact = res.stats[mealTime];
        const values = findValuesForTypeEaters(resPlan, resFact, typeOfEater);
        statsPlan[mealTime] = values.planValue;
        statsFact[mealTime] = values.factValue;
        statsPlan.total += values.planValue;
        statsFact.total += values.factValue;
    }
    return [
        { key: '1', mealTimeType: 'завтрак', plan: statsPlan.morning, fact: statsFact.morning },
        { key: '2', mealTimeType: 'обед', plan: statsPlan.lunch, fact: statsFact.lunch },
        { key: '3', mealTimeType: 'ужин', plan: statsPlan.dinner, fact: statsFact.dinner },
        { key: '4', mealTimeType: 'дожор', plan: statsPlan.night, fact: statsFact.night },
        { key: '5', mealTimeType: 'всего', plan: statsPlan.total, fact: statsFact.total }
    ];
}
/**Преобразование данных от сервера для столбчатого графика*/
export function handleDataForColumnChart(res: IStatisticsAPI, typeOfEater: TypeOfEaters): IColumnChartData[] {
    const result: IColumnChartData[] = [];
    if (!res) {
        return result;
    }
    for (let date in res) {
        for (let mealTime of mealTimesEnArr) {
            const resPlan = res[date].nutritionTypePlanned[mealTime];
            const resFact = res[date].stats[mealTime];
            const values = findValuesForTypeEaters(resPlan, resFact, typeOfEater);
            result.push(
                { category: 'план', date, mealTime: mealTimeRuObj[mealTime], value: values.planValue },
                { category: 'факт', date, mealTime: mealTimeRuObj[mealTime], value: values.factValue }
            );
        }
    }
    return result;
}
/**Преобразование данных от сервера для линейного графика*/
export function handleDataForLinearChart(res: IStatisticsAPI, typeOfEater: TypeOfEaters): ILinearChartData[] {
    const result: ILinearChartData[] = [];
    if (!res) {
        return result;
    }
    for (let date in res) {
        const resPlan = res[date].nutritionTypePlanned.total;
        const resFact = res[date].stats.total;
        const values = findValuesForTypeEaters(resPlan, resFact, typeOfEater);
        result.push(
            { category: 'план', date, value: values.planValue },
            { category: 'факт', date, value: values.factValue }
        );
    }
    return result;
}
