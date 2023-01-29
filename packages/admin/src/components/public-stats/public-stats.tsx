import React, { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { useList } from '@pankod/refine-core';
import { VolEntity } from '~/interfaces';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });

const factMock = [
    {
        date: new Date('2023-07-01'),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date('2023-07-02'),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date('2023-07-03'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date('2023-07-04'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date('2023-07-05'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: new Date('2023-07-06'),
        value: 6,
        category: 'Фактически накормлено, чел'
    }
];

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
        start: new Date('2023-07-01'),
        end: new Date('2023-07-30')
    });
    const timeDataArr: Array<{}> = [];
    for (
        let currentDate = timePeriod.start.getTime();
        currentDate <= timePeriod.end.getTime();
        currentDate += 1000 * 60 * 60 * 24
    ) {
        const date = new Date(currentDate);
        const planFeedCount = data?.data.filter((volData) => {
            const activeToDate = new Date(volData.activeTo ? volData.activeTo : '');
            if (activeToDate >= date) return true;
            return false;
        }).length;
        let factFeedCount = 0;
        factMock.forEach((factData) => {
            if (factData.date.getTime() === date.getTime()) factFeedCount += factData.value;
        });
        timeDataArr.push({ date: date, value: planFeedCount, category: 'Необходимо накормить, чел' });
        timeDataArr.push({ date: date, value: factFeedCount, category: 'Фактически накормлено, чел' });
    }
    const config = {
        data: timeDataArr,
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
            type: 'time'
        }
    };
    return (
        <Fragment>
            <RangePicker
                onChange={(_, range) => {
                    console.log(range);
                    setTimePeriod({
                        start: new Date(range[0]),
                        end: new Date(range[1])
                    });
                }}
            />
            <Line {...config} />
        </Fragment>
    );
}
