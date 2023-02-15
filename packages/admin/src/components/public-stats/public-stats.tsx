import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useList } from '@pankod/refine-core';
import { VolEntity } from '~/interfaces';
import { DatePicker } from 'antd';
import { default as dayjsExt } from '~/dateHelper';
const { RangePicker } = DatePicker;
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });
const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), { ssr: false });

interface IColumnData {
    date: string;
    category: 'план' | 'факт';
    value: number;
    mealTime: 'завтрак' | 'обед' | 'ужин';
}
// Настройки для линейного графика
const lineConfig = {
    xField: 'date',
    yField: 'value',
    seriesField: 'category'
};
// Настройки для столбчатого графика
const columnConfig = {
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

export function PublicStats() {
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
    const lineDataArr: Array<{}> = [];
    const columnDataArr: Array<IColumnData> = [];
    //Цикл перебора дней в интервале дат (по умолчанию интервал "сегодня - завтра")
    for (
        let currentDate = timePeriod.start.valueOf();
        currentDate <= timePeriod.end.valueOf();
        currentDate = dayjsExt(currentDate).add(1, 'day').startOf('date').valueOf()
    ) {
        const date = dayjsExt(currentDate);
        const dateStr = date.format('DD.MM.YYYY');
        const planHumansCount = vols?.data.filter((volData) => {
            const activeToDate = new Date(volData.activeTo ? volData.activeTo : '');
            if (dayjsExt(activeToDate).valueOf() >= date.valueOf()) {
                return true;
            }
            return false;
        }).length;
        let factHumansCount = 0;
        factMock.forEach((factData) => {
            if (date.isSame(factData.date, 'year')) {
                factHumansCount += factData.value;
            }
        });
        lineDataArr.push({ date: dateStr, value: planHumansCount, category: 'Необходимо накормить, чел' });
        lineDataArr.push({ date: dateStr, value: factHumansCount, category: 'Фактически накормлено, чел' });
        columnDataArr.push(
            { date: dateStr, category: 'план', value: Number(planHumansCount), mealTime: 'завтрак' },
            { date: dateStr, category: 'план', value: Number(planHumansCount), mealTime: 'обед' },
            { date: dateStr, category: 'план', value: Number(planHumansCount), mealTime: 'ужин' }
        );
        columnDataArr.push(
            { date: dateStr, category: 'факт', value: Number(factHumansCount), mealTime: 'завтрак' },
            { date: dateStr, category: 'факт', value: Number(factHumansCount), mealTime: 'обед' },
            { date: dateStr, category: 'факт', value: Number(factHumansCount), mealTime: 'ужин' }
        );
    }
    return (
        <div>
            <RangePicker
                onChange={(_, range) => {
                    console.log(range);
                    setTimePeriod({
                        start: dayjsExt(range[0]),
                        end: dayjsExt(range[1])
                    });
                }}
            />
            <Line data={lineDataArr} {...lineConfig} />
            <Column data={columnDataArr} {...columnConfig} />
        </div>
    );
}

const factMock = [
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
