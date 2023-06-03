import { ColumnConfig, Options } from '@ant-design/plots';
import dynamic from 'next/dynamic';
import { MealTime, StatisticType } from '../types';
const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), { ssr: false });

/** Данные для столбчатого графика */
interface IColumnChartData {
    date: string;
    type: StatisticType;
    value: number;
    mealTime: MealTime;
}

type IColumnChartAnnotationData = {
    date: string;
    plan: number;
    fact: number;
};

const annotation = {
    type: 'text',
    style: {
        textAlign: 'center' as const,
        fontSize: 14,
        fill: 'rgba(0,0,0,0.85)'
    },
    offsetY: -20
};

function createAnnotation(data: IColumnChartAnnotationData[]) {
    const annotations: Options['annotations'] = [];
    data.forEach((datum, index) => {
        annotations.push(
            { ...annotation, position: [index, 4], content: datum.plan, offsetX: -40 },
            { ...annotation, position: [index, 4], content: datum.fact, offsetX: 40 }
        );
    });
    return annotations;
}

/**Настройки для столбчатого графика*/
const columnConfig: Omit<ColumnConfig, 'data'> = {
    xField: 'date',
    yField: 'value',
    isGroup: true,
    isStack: true,
    seriesField: 'mealTime',
    groupField: 'type',
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
            name: `${datum.mealTime} ${datum.type === 'plan' ? 'plan' : 'fact'}`,
            value: datum.value
        })
    },
    interactions: [
        {
            type: 'element-highlight-by-color'
        }
    ]
};

function ColumnChart(props: { columnDataArr: IColumnChartData[]; dataForAnnotation: IColumnChartAnnotationData[] }) {
    console.log(props.dataForAnnotation);
    const annotations = createAnnotation(props.dataForAnnotation);
    return <Column data={props.columnDataArr} {...columnConfig} annotations={annotations} />;
}
export { ColumnChart };
export type { IColumnChartData, IColumnChartAnnotationData };
