import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useList } from '@pankod/refine-core';
import { VolEntity } from '~/interfaces';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });
const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), { ssr: false });

interface IColumnData {
    date: string;
    category: 'план' | 'факт';
    value: number;
    mealTime: 'завтрак' | 'обед' | 'ужин';
}

const msInDay = 1000 * 60 * 60 * 24;

function convertDateToString(date: Date) {
    const year = String(date.getFullYear());
    const month =
        String(date.getMonth() + 1).length === 2 ? String(date.getMonth() + 1) : '0' + String(date.getMonth() + 1);
    const day = String(date.getDate()).length === 2 ? String(date.getDate()) : '0' + String(date.getDate());
    return `${day}.${month}.${year}`;
}

export function PublicStats() {
    const { data } = useList<VolEntity>({
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
        start: new Date(),
        end: new Date(new Date().getTime() + msInDay)
    });
    const lineDataArr: Array<{}> = [];
    const columnDataArr: Array<IColumnData> = [];
    //Цикл перебора дней в интервале дат (по умолчанию интервал "сегодня - завтра")
    for (
        let currentDate = timePeriod.start.getTime();
        currentDate <= timePeriod.end.getTime();
        currentDate += msInDay
    ) {
        const date = new Date(currentDate);
        const dateStr = convertDateToString(date);
        const planHumansCount = data?.data.filter((volData) => {
            const activeToDate = new Date(volData.activeTo ? volData.activeTo : '');
            if (activeToDate >= date) return true;
            return false;
        }).length;
        let factHumansCount = 0;
        factMock.forEach((factData) => {
            if (factData.date.getTime() - date.getTime() >= 0 && factData.date.getTime() - date.getTime() <= msInDay) {
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
    const lineConfig = {
        data: lineDataArr,
        xField: 'date',
        yField: 'value',
        seriesField: 'category'
    };
    const columnConfig = {
        data: columnDataArr,
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
    return (
        <div>
            <RangePicker
                onChange={(_, range) => {
                    console.log(range);
                    setTimePeriod({
                        start: new Date(range[0]),
                        end: new Date(range[1])
                    });
                }}
            />
            <Line {...lineConfig} />
            <Column {...columnConfig} />
        </div>
    );
}

const factMock = [
    {
        date: new Date(),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date(new Date().getTime() + msInDay),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date(new Date().getTime() + 2 * msInDay),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date(new Date().getTime() + 3 * msInDay),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date(new Date().getTime() + 4 * msInDay),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date(new Date().getTime() + 5 * msInDay),
        value: 6,
        category: 'Фактически накормлено, чел'
    }
];
