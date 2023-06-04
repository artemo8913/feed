import { useState, useCallback, useEffect } from 'react';
import { Form, Radio, DatePicker, Divider, Button, Space } from 'antd';
import { RadioChangeEvent } from '@pankod/refine-antd';
import { default as dayjsExt } from '../lib/dateHelper';
import TableStats, { ITableStatData } from './tableStats';
import locale from 'antd/lib/date-picker/locale/ru_RU';
import LinearChart, { ILinearChartData } from './linearChart';
import { ColumnChart, IColumnChartData } from './columnChart';
import { EaterTypeExtended, IStatisticApi, IStatisticResponce } from '../types';
import {
    convertResponceToData,
    handleDataForColumnChart,
    handleDataForTable,
    handleDataForLinearChart
} from '../lib/handleData';
import { NEW_API_URL } from '~/const';
import axios from 'axios';

type StatisticViewType = 'date' | 'range';

const { RangePicker } = DatePicker;
const dateFormat = 'DD.MM.YYYY';

function convertDateToStringForApi(date: dayjsExt.Dayjs | null | undefined) {
    if (!date) {
        return dayjsExt().format('YYYY-MM-DD');
    }
    return date.format('YYYY-MM-DD');
}
function sordResponceByDate(a: IStatisticApi, b: IStatisticApi): 1 | -1 | 0 {
    if (dayjsExt(a.date).isAfter(b.date)) return 1;
    else return -1;
}

function PublicStatistic() {
    // Выбор отображения (таблица / графики)
    const [statisticViewType, setViewType] = useState<StatisticViewType>('date');
    const changeStatisticViewType = (e: RadioChangeEvent) => setViewType(e.target?.value);
    // Фильтр типа питания
    const [typeOfEater, setTypeOfEater] = useState<EaterTypeExtended>('all');
    const changeTypeOfEater = (e: RadioChangeEvent) => setTypeOfEater(e.target?.value);

    // Данные для дальнейшей обработки и отображения
    const [responce, setResponce] = useState<IStatisticResponce>([]);

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
    const dateStr = convertDateToStringForApi(date);
    const prevDateStr = convertDateToStringForApi(date?.add(-1, 'day'));
    const nextDateStr = convertDateToStringForApi(date?.add(1, 'day'));

    // Для выбора диапазона дат для линейчатого графика
    const [timePeriod, setTimePeriod] = useState([
        dayjsExt().add(-1, 'day').startOf('date'),
        dayjsExt().add(1, 'day').startOf('date')
    ]);
    const changeTimePeriod = useCallback((range: dayjsExt.Dayjs[] | null) => {
        if (!range) return;
        setTimePeriod([dayjsExt(range[0]), dayjsExt(range[1])]);
    }, []);
    const startDatePeriodStr = convertDateToStringForApi(timePeriod[0]);
    const endDatePeriodStr = convertDateToStringForApi(timePeriod[1]);

    // Запрос данных с сервера
    let url = `${NEW_API_URL}/statistics/?date_from=${prevDateStr}&date_to=${nextDateStr}`;
    if (statisticViewType === 'range') {
        url = `${NEW_API_URL}/statistics/?date_from=${startDatePeriodStr}&date_to=${endDatePeriodStr}`;
    }
    useEffect(() => {
        axios.get(url).then((res) => {
            const sortedResponce = res.data.sort(sordResponceByDate);
            setResponce(sortedResponce);
        });
    }, [url]);
    // Преобразование данных с сервера для таблицы и графиков
    const dataForTable: ITableStatData[] = handleDataForTable(convertResponceToData(responce), dateStr, typeOfEater);
    const { dataForColumnChart, dataForAnnotation } = handleDataForColumnChart(
        convertResponceToData(responce),
        typeOfEater
    );
    const dataForLinearChart: ILinearChartData[] = handleDataForLinearChart(
        convertResponceToData(responce),
        typeOfEater
    );
    return (
        <>
            <Form layout='inline'>
                <Form.Item>
                    <Radio.Group value={statisticViewType} onChange={changeStatisticViewType}>
                        <Radio.Button value='date'>На дату</Radio.Button>
                        <Radio.Button value='range'>Диапазон дат</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
            <Form layout='inline'>
                <Form.Item label='Тип людей по питанию'>
                    <Radio.Group value={typeOfEater} onChange={changeTypeOfEater}>
                        <Radio.Button value='all'>Все</Radio.Button>
                        <Radio.Button value='meatEater'>Мясоеды</Radio.Button>
                        <Radio.Button value='vegan'>Вегетерианцы</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    {statisticViewType === 'date' ? (
                        <Space size={'small'}>
                            <Button onClick={() => changeDateByOneDay(date, 'decrement')}>{'<'}</Button>
                            <DatePicker locale={locale} value={date} onChange={changeDate} format={dateFormat} />
                            <Button onClick={() => changeDateByOneDay(date, 'increment')}>{'>'}</Button>
                        </Space>
                    ) : (
                        <RangePicker
                            locale={locale}
                            format={dateFormat}
                            onChange={(range) => changeTimePeriod(range as dayjsExt.Dayjs[])}
                        />
                    )}
                </Form.Item>
            </Form>
            {statisticViewType === 'date' ? (
                <>
                    <TableStats data={dataForTable} />
                    <Divider />
                    <ColumnChart columnDataArr={dataForColumnChart} dataForAnnotation={dataForAnnotation} />
                </>
            ) : (
                <LinearChart linearChartData={dataForLinearChart} />
            )}
        </>
    );
}
export { PublicStatistic };
