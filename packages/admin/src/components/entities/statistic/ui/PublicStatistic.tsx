import { useState, useCallback } from 'react';
import { Col, Row, Form, Radio, DatePicker, Divider, Button, Space } from 'antd';
import { RadioChangeEvent } from '@pankod/refine-antd';
import { default as dayjsExt } from '../lib/dateHealper';
import TableStats from './TableStats';
import locale from 'antd/lib/date-picker/locale/ru_RU';
import { apiMock } from '../lib/mock';
import LinearChart from './LinearChart';
import ColumnChart from './ColumnChart';
import { TypeOfEaters } from '../types';
import { handleDataForColumnChart, handleDataForLinearChart, handleDataForTable } from '../lib/handleData';

type StatisticViewType = 'table' | 'charts';

const { RangePicker } = DatePicker;
const dateFormat = 'DD.MM.YYYY';
// const apiUrl = 'https://yclins.cherepusick.keenetic.name/feeds';

function convertDateToStringForApi(date: dayjsExt.Dayjs | null) {
    if (!date) {
        return dayjsExt().format('YYYY-MM-DD HH:mm:ss');
    }
    return date.format('YYYY-MM-DD HH:mm:ss');
}

function PublicStatistic() {
    // Выбор отображения (таблица / графики)
    const [statisticViewType, setViewType] = useState<StatisticViewType>('table');
    const changeStatisticViewType = (e: RadioChangeEvent) => setViewType(e.target?.value);

    // Фильтр типа питания
    const [typeOfEater, setTypeOfEater] = useState<TypeOfEaters>('all');
    const changeTypeOfEater = (e: RadioChangeEvent) => setTypeOfEater(e.target?.value);

    // Для выбора даты
    const [date, setDate] = useState<dayjsExt.Dayjs | null>(dayjsExt().startOf('date'));
    const changeDate = (value: dayjsExt.Dayjs | null, dateString: string) => setDate(value);
    const changeDateByOneDay = useCallback((date: dayjsExt.Dayjs | null, direction: 'increment' | 'decrement') => {
        if (!date) {
            const today = dayjsExt();
            setDate(today);
        } else if (direction === 'increment') {
            setDate(date.add(1, 'day'));
        } else if (direction === 'decrement') {
            setDate(date.add(-1, 'day'));
        }
    }, []);

    // Для выбора диапазона дат. Нужен будет для API запроса для графиков
    const [timePeriod, setTimePeriod] = useState([
        dayjsExt().startOf('date'),
        dayjsExt().add(1, 'day').startOf('date')
    ]);
    const changeTimePeriod = useCallback((_, range: [string, string]) => {
        setTimePeriod([dayjsExt(range[0], 'YYYY-MM-DD'), dayjsExt(range[1], 'YYYY-MM-DD')]);
    }, []);

    // Преобразование данных с сервера для таблицы и графиков
    const dataForTable = handleDataForTable(apiMock[convertDateToStringForApi(date)], typeOfEater);
    const dataForColumnChart = handleDataForColumnChart(apiMock, typeOfEater);
    const dataForLinearChart = handleDataForLinearChart(apiMock, typeOfEater);

    return (
        <Row gutter={[0, 8]}>
            <Col span={16} offset={4}>
                <Form layout='inline'>
                    <Form.Item>
                        <Radio.Group value={statisticViewType} onChange={changeStatisticViewType}>
                            <Radio.Button value='table'>Таблица</Radio.Button>
                            <Radio.Button value='charts'>Графики</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={16} offset={4}>
                <Form layout='inline'>
                    <Form.Item label='Тип людей по питанию'>
                        <Radio.Group value={typeOfEater} onChange={changeTypeOfEater}>
                            <Radio.Button value='all'>Все</Radio.Button>
                            <Radio.Button value='meatEaters'>Мясоеды</Radio.Button>
                            <Radio.Button value='vegetarian'>Вегетерианцы</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        {statisticViewType === 'table' ? (
                            <Space size={'small'}>
                                <Button onClick={() => changeDateByOneDay(date, 'decrement')}>{'<'}</Button>
                                <DatePicker locale={locale} value={date} onChange={changeDate} format={dateFormat} />
                                <Button onClick={() => changeDateByOneDay(date, 'increment')}>{'>'}</Button>
                            </Space>
                        ) : (
                            <RangePicker locale={locale} format={dateFormat} onChange={changeTimePeriod} />
                        )}
                    </Form.Item>
                </Form>
            </Col>
            <Col span={16} offset={4}>
                {statisticViewType === 'table' ? (
                    <TableStats data={dataForTable} />
                ) : (
                    <>
                        <LinearChart lineDataArr={dataForLinearChart} />
                        <Divider />
                        <ColumnChart columnDataArr={dataForColumnChart} />
                    </>
                )}
            </Col>
        </Row>
    );
}
export { PublicStatistic };