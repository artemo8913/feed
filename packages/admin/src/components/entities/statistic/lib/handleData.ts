import {
    IStatisticResponce,
    IData,
    datumInstance,
    EaterType,
    IEaterTypeAmount,
    mealTimeArr,
    EaterTypeExtended
} from '../types';
import { ILinearChartData } from '../ui/linearChart';
import { IColumnChartData, IColumnChartAnnotationData } from '../ui/columnChart';
import { ITableStatData } from '../ui/tableStats';

export function convertResponceToData(res: IStatisticResponce): IData {
    const result: IData = {};

    res.forEach((datum) => {
        const { date, amount, is_vegan, kitchen_id, meal_time, type } = datum;
        const eaterType: EaterType = is_vegan ? 'vegan' : 'meatEater';

        if (!(date in result)) {
            result[date] = JSON.parse(JSON.stringify(datumInstance));
        }
        result[date][type][meal_time][eaterType] += amount;
        result[date][type].total[eaterType] += amount;
    });
    return result;
}

//Функции для обработки данных
/** Найти в зависимости от типа питания человека план / факт питания. Применяется при поиске для каждого приема пищи (завтра, обед т.д.)*/
function findValuesForTypeEaters(
    resPlan: IEaterTypeAmount,
    resFact: IEaterTypeAmount,
    typeOfEater?: EaterTypeExtended
): { plan: number; fact: number } {
    const shallowCopy = { plan: 0, fact: 0 };
    if (typeOfEater === 'meatEater') {
        shallowCopy.plan = resPlan.meatEater;
        shallowCopy.fact = resFact.meatEater;
    } else if (typeOfEater === 'vegan') {
        shallowCopy.plan = resPlan.vegan;
        shallowCopy.fact = resFact.vegan;
    } else {
        shallowCopy.plan = resPlan.vegan + resPlan.meatEater;
        shallowCopy.fact = resFact.vegan + resFact.meatEater;
    }
    return shallowCopy;
}

/**Преобразование данных для сравнительной сводной таблицы*/
export function handleDataForTable(data: IData, date: string, typeOfEater: EaterTypeExtended): ITableStatData[] {
    if (Object.keys(data).length === 0) {
        return [];
    }

    const datum = data[date];
    const plan = { breakfast: 0, lunch: 0, dinner: 0, overeating: 0, total: 0 };
    const fact = { breakfast: 0, lunch: 0, dinner: 0, overeating: 0, total: 0 };
    for (let mealTime of mealTimeArr) {
        const resPlan = datum.plan[mealTime];
        const resFact = datum.fact[mealTime];
        const values = findValuesForTypeEaters(resPlan, resFact, typeOfEater);
        plan[mealTime] = values.plan;
        fact[mealTime] = values.fact;
        plan.total += values.plan;
        fact.total += values.fact;
    }
    return [
        { key: '1', mealTimeType: 'breakfast', plan: plan.breakfast, fact: fact.breakfast },
        { key: '2', mealTimeType: 'lunch', plan: plan.lunch, fact: fact.lunch },
        { key: '3', mealTimeType: 'dinner', plan: plan.dinner, fact: fact.dinner },
        { key: '4', mealTimeType: 'night', plan: plan.overeating, fact: fact.overeating },
        { key: '5', mealTimeType: 'total', plan: plan.total, fact: fact.total }
    ];
}

/**Преобразование данных от сервера для столбчатого графика*/
export function handleDataForColumnChart(
    data: IData,
    typeOfEater: EaterTypeExtended
): { dataForColumnChart: IColumnChartData[]; dataForAnnotation: IColumnChartAnnotationData[] } {
    const dataForColumnChart: IColumnChartData[] = [];
    const dataForAnnotation: IColumnChartAnnotationData[] = [];

    if (Object.keys(data).length === 0) {
        return { dataForColumnChart, dataForAnnotation };
    }

    for (let date in data) {
        for (let mealTime of mealTimeArr) {
            const resPlan = data[date].plan[mealTime];
            const resFact = data[date].fact[mealTime];
            const values = findValuesForTypeEaters(resPlan, resFact, typeOfEater);
            dataForColumnChart.push(
                { date, type: 'plan', mealTime, value: values.plan },
                { date, type: 'fact', mealTime, value: values.fact }
            );
        }
        const resPlan = data[date].plan.total;
        const resFact = data[date].fact.total;
        const values = findValuesForTypeEaters(resPlan, resFact, typeOfEater);
        dataForAnnotation.push({
            date,
            ...values
        });
    }
    return { dataForColumnChart, dataForAnnotation };
}
/**Преобразование данных от сервера для линейного графика*/
export function handleDataForLinearChart(data: IData, typeOfEater: EaterTypeExtended): ILinearChartData[] {
    const result: ILinearChartData[] = [];
    if (Object.keys(data).length === 0) {
        return result;
    }

    for (let date in data) {
        const resPlan = data[date].plan.total;
        const resFact = data[date].fact.total;
        const values = findValuesForTypeEaters(resPlan, resFact, typeOfEater);
        result.push({ type: 'plan', date, value: values.plan }, { type: 'fact', date, value: values.fact });
    }
    return result;
}
