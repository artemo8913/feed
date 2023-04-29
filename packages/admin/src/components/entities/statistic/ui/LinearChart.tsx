import { LineConfig } from '@ant-design/plots';
import dynamic from 'next/dynamic';
import { StatisticCategoriesRu } from '../types';
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });

/** Данные для линейного графика */
interface ILinearChartData {
    date: string;
    value: number;
    category: StatisticCategoriesRu;
}

/**Настройки для линейчатого графика*/
const lineConfig: Omit<LineConfig, 'data'> = {
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
        tickInterval: 5
    }
};
export default function LinearChart(props: { lineDataArr: ILinearChartData[] }) {
    return <Line data={props.lineDataArr} {...lineConfig} />;
}
export type { ILinearChartData };
