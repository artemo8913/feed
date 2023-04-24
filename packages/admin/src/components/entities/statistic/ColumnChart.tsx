import { ColumnConfig } from '@ant-design/plots';
import dynamic from 'next/dynamic';
const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), { ssr: false });

interface IColumnData {
    date: string;
    category: 'план' | 'факт';
    value: number;
    mealTime: 'завтрак' | 'обед' | 'ужин';
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

export default function ColumnChart(props: { columnDataArr: IColumnData[] }) {
    <Column data={props.columnDataArr} {...columnConfig} />;
}
