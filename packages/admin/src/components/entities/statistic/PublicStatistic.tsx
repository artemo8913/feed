import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { GetListResponse, useList } from '@pankod/refine-core';
import { VolEntity } from '~/interfaces';
import { DatePicker } from 'antd';
import { default as dayjsExt } from './dateHealper';
import { ColumnConfig, LineConfig } from '@ant-design/plots';

import { apiMock } from './mock';
import { TableStats } from './TableStats';

const { RangePicker } = DatePicker;
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });
const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), { ssr: false });

export interface IFactMockData {
    date: dayjsExt.Dayjs;
    value: number;
    category: string;
}

const factDataMock: Array<IFactMockData> = [
    {
        date: dayjsExt(),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(1, 'day'),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(2, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(3, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(4, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(5, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    }
];

/**Настройки для линейчатого графика*/
const lineConfig: Omit<LineConfig, 'data'> = {
    xField: 'date',
    yField: 'value',
    seriesField: 'category'
};
interface ILineData {
    date: string;
    value: number;
    category: 'Необходимо накормить, чел' | 'Фактически накормлено, чел';
}
/**Настройки для столбчатого графика*/
const columnConfig: Omit<ColumnConfig, 'data'> = {
    xField: 'date',
    yField: 'value',
    isGroup: true,
    isStack: true,
    seriesField: 'mealTime',
    groupField: 'category',
    tooltip: {
        formatter: (datum) => ({
            name: `${datum.mealTime} ${datum.category === 'план' ? 'план' : 'факт'}`,
            value: datum.value
        })
    }
};
interface IColumnData {
    date: string;
    category: 'план' | 'факт';
    value: number;
    mealTime: 'завтрак' | 'обед' | 'ужин';
}
/**Возращает количество волонтеров, которые будет находится в поле в определенную дату.
Отфильтровывается массив с волонтерами, activeTo которых не менее переданной в функцию даты */
function findHowManyHumansPlanToEat(vols: GetListResponse<VolEntity> | undefined, date: dayjsExt.Dayjs) {
    const humanCount = vols?.data.filter((volData) => {
        if (!volData.activeTo) {
            return false;
        }
        const dateActiveTo = dayjsExt(volData.activeTo);
        if (dayjsExt(dateActiveTo).valueOf() >= date.valueOf()) {
            return true;
        }
        return false;
    }).length;
    return humanCount || 0;
}
/**Возращает количество волонтеров, которое фактически поели в определенную дату. */
function findHowManyHumansEat(factData: Array<IFactMockData>, date: dayjsExt.Dayjs) {
    const factHumansCountGoingToEat = factData.filter((factData) => {
        if (!factData.date) {
            return false;
        }
        if (date.isSame(factData.date, 'date')) {
            return true;
        }
        return false;
    }).length;
    return factHumansCountGoingToEat || 0;
}

export function PublicStatistic() {
    const { data: vols } = useList<VolEntity>({
        resource: 'vols',
        config: {
            filters: [
                {
                    field: 'isActive',
                    operator: 'eq',
                    value: true
                },
                {
                    field: 'isBlocked',
                    operator: 'eq',
                    value: false
                }
            ]
        }
    });
    const [timePeriod, setTimePeriod] = useState({
        start: dayjsExt().startOf('date'),
        end: dayjsExt().add(1, 'day').startOf('date')
    });
    const changeTimePeriod = useCallback((_, range: [string, string]) => {
        setTimePeriod({
            start: dayjsExt(range[0], 'YYYY-MM-DD'),
            end: dayjsExt(range[1], 'YYYY-MM-DD')
        });
    }, []);
    /**Массив с данными для построения линейчатого графика */
    const lineDataArr: Array<ILineData> = [];
    /**Массив с данными для построения столбачтого графика */
    const columnDataArr: Array<IColumnData> = [];
    //Цикл перебора дней в интервале дат (по умолчанию интервал "сегодня - завтра")
    for (
        let currentDate = timePeriod.start.valueOf();
        currentDate <= timePeriod.end.valueOf();
        currentDate = dayjsExt(currentDate).add(1, 'day').startOf('date').valueOf()
    ) {
        const date = dayjsExt(currentDate);
        const dateStr = date.format('DD.MM.YYYY');
        const planHumansCountGoingToEat = findHowManyHumansPlanToEat(vols, date);
        const factHumansCountGoingToEat = findHowManyHumansEat(factDataMock, date);
        lineDataArr.push({ date: dateStr, value: planHumansCountGoingToEat, category: 'Необходимо накормить, чел' });
        lineDataArr.push({ date: dateStr, value: factHumansCountGoingToEat, category: 'Фактически накормлено, чел' });
        columnDataArr.push(
            { date: dateStr, category: 'план', value: Number(planHumansCountGoingToEat), mealTime: 'завтрак' },
            { date: dateStr, category: 'план', value: Number(planHumansCountGoingToEat), mealTime: 'обед' },
            { date: dateStr, category: 'план', value: Number(planHumansCountGoingToEat), mealTime: 'ужин' }
        );
        columnDataArr.push(
            { date: dateStr, category: 'факт', value: Number(factHumansCountGoingToEat), mealTime: 'завтрак' },
            { date: dateStr, category: 'факт', value: Number(factHumansCountGoingToEat), mealTime: 'обед' },
            { date: dateStr, category: 'факт', value: Number(factHumansCountGoingToEat), mealTime: 'ужин' }
        );
    }
    return (
        <div>
            <TableStats />
            <RangePicker onChange={changeTimePeriod} />
            <Line data={lineDataArr} {...lineConfig} />
            <br />
            <Column data={columnDataArr} {...columnConfig} />
        </div>
    );
}
