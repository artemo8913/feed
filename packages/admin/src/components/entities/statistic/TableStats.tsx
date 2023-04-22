import { Table, Col, Row, Form, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
    key: string;
    mealTimeCount: string;
    nutritionTypePlanned: number;
    statsFact: number;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Прием пищи',
        dataIndex: 'mealTimeCount',
        key: 'mealTimeCount'
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

const data: DataType[] = [
    {
        key: '1',
        mealTimeCount: 'завтрак',
        nutritionTypePlanned: 1,
        statsFact: 1
    },
    {
        key: '2',
        mealTimeCount: 'обед',
        nutritionTypePlanned: 1,
        statsFact: 1
    },
    {
        key: '3',
        mealTimeCount: 'ужин',
        nutritionTypePlanned: 1,
        statsFact: 1
    },
    {
        key: '4',
        mealTimeCount: 'всего',
        nutritionTypePlanned: 1,
        statsFact: 1
    }
];

export const TableStats: FC = () => (
    <Row>
        <Col span={16} offset={4}>
            <Form.Item label='Table Scroll'>
                <Radio.Group value={10} onChange={() => 2}>
                    <Radio.Button value={undefined}>Unset</Radio.Button>
                    <Radio.Button value='scroll'>Scroll</Radio.Button>
                    <Radio.Button value='fixed'>Fixed Columns</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Table
                title={() => <b>Таблица №1</b>}
                bordered
                size='small'
                pagination={false}
                columns={columns}
                dataSource={data}
            />
        </Col>
    </Row>
);
