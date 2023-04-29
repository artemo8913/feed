import { ColumnConfig } from '@ant-design/plots';
import dynamic from 'next/dynamic';
import { MealTimeRU, StatisticCategoriesRu } from "../types";
const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), { ssr: false });

/** Данные для столбчатого графика */
interface IColumnChartData {
    date: string;
    category: StatisticCategoriesRu;
    value: number;
    mealTime: MealTimeRU;
}
/**Настройки для столбчатого графика*/
const columnConfig: Omit<ColumnConfig, 'data'> = {
    xField: 'date',
    yField: 'value',
    isGroup: true,
    isStack: true,
    seriesField: 'mealTime',
    groupField: 'category',
    yAxis: { tickInterval: 5 },
    label: {
        position: 'middle',
        layout: [
            {
                type: 'adjust-color'
            }
        ]
    },
    // tooltip: false,
    tooltip: {
        formatter: (datum) => ({
            name: `${datum.mealTime} ${datum.category === 'план' ? 'план' : 'факт'}`,
            value: datum.value
        })
    },
    interactions: [
        {
            type: 'element-highlight-by-color'
        }
    ]
};

function ColumnChart(props: { columnDataArr: IColumnChartData[] }) {
    return <Column data={props.columnDataArr} {...columnConfig} />;
}
export default ColumnChart;
export type { IColumnChartData };
