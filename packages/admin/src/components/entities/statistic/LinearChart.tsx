import { LineConfig } from '@ant-design/plots';
import dynamic from 'next/dynamic';
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line), { ssr: false });

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
export default function LinearChart(props: { lineDataArr: ILineData[] }) {
    return <Line data={props.lineDataArr} {...lineConfig} />;
}
