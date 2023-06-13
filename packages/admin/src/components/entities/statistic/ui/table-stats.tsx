import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { MealTime } from '../types';

interface ITableStatData {
    key: string;
    mealTimeType: MealTime | 'total';
    plan: number;
    fact: number;
}
const columns: ColumnsType<ITableStatData> = [
    {
        title: 'Прием пищи',
        dataIndex: 'mealTimeType',
        key: 'mealTimeType'
    },
    {
        title: 'Факт (количество приемов пищи)',
        dataIndex: 'fact',
        key: 'fact'
    },
    {
        title: 'План (по количеству людей на поле)',
        dataIndex: 'plan',
        key: 'plan'
    }
];

function TableStats(props: { data: Array<ITableStatData> }) {
    return (
        <Table
            title={() => <b>Сравнительная таблица по питанию</b>}
            bordered
            size='small'
            pagination={false}
            columns={columns}
            dataSource={props.data}
        />
    );
}
export default TableStats;
export type { ITableStatData };
