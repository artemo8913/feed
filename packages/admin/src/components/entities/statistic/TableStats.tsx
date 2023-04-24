import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MealTimeRU } from './PublicStatistic';

interface TableStatDataType {
    key: string;
    mealTimeType: MealTimeRU;
    nutritionTypePlanned: number;
    statsFact: number;
}
const columns: ColumnsType<TableStatDataType> = [
    {
        title: 'Прием пищи',
        dataIndex: 'mealTimeType',
        key: 'mealTimeType'
    },
    {
        title: 'План (по количеству людей на поле)',
        dataIndex: 'nutritionTypePlanned',
        key: 'nutritionTypePlanned'
    },
    {
        title: 'Факт (количество приемов пищи)',
        dataIndex: 'statsFact',
        key: 'statsFact'
    }
];

function TableStats(props: { data: TableStatDataType[] }) {
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
export type { TableStatDataType };
