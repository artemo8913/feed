import type { LineConfig } from '@ant-design/plots';
import dynamic from 'next/dynamic';

import type { StatisticType } from '../types';
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });

/** Данные для линейного графика */
interface ILinearChartData {
    date: string;
    value: number;
    type: StatisticType;
}

/**Настройки для линейчатого графика*/
const lineConfig: Omit<LineConfig, 'data'> = {
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
        tickInterval: 5
    }
};
export default function LinearChart(props: { linearChartData: Array<ILinearChartData> }) {
    return <Line data={props.linearChartData} {...lineConfig} />;
}
export type { ILinearChartData };
