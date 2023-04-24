import { useState, useCallback } from 'react';
import { Col, Row, Form, Radio, DatePicker, Divider } from 'antd';
import { RadioChangeEvent } from '@pankod/refine-antd';
import { default as dayjsExt } from './dateHealper';
import TableStats, { TableStatDataType } from './TableStats';
import locale from 'antd/lib/date-picker/locale/ru_RU';
import { apiMock, ICurrentAPI } from './mock';
import LinearChart from './LinearChart';
import ColumnChart from './ColumnChart';

type TypeOfHumans = 'all' | 'meatEaters' | 'vegetarian';
type MealTimeEN = 'morning' | 'lunch' | 'dinner' | 'night' | 'total';
type MealTimeRU = 'завтрак' | 'обед' | 'ужин' | 'дожор' | 'всего';

const { RangePicker } = DatePicker;
const dateFormat = 'DD.MM.YYYY';
const apiUrl = 'https://yclins.cherepusick.keenetic.name/feeds';

//Функции для обработки данных
function handleDataForTable(res: ICurrentAPI, typeOfEater: TypeOfHumans): TableStatDataType[] {
    if (!res) {
        return [];
    }
    const statsFact = { morning: 0, lunch: 0, dinner: 0, night: 0, total: 0 };
    let nutritionTypePlanned = 0;
    let totalNutritionTypePlanned = 0;
    for (let mealTime in statsFact) {
        if (typeOfEater === 'all') {
            statsFact[mealTime] = res.stats[mealTime]['веган'] + res.stats[mealTime]['мясоед'];
        } else if (typeOfEater === 'meatEaters') {
            statsFact[mealTime] = res.stats[mealTime]['мясоед'];
        } else if (typeOfEater === 'vegetarian') {
            statsFact[mealTime] = res.stats[mealTime]['веган'];
        }
    }

    if (typeOfEater === 'all') {
        nutritionTypePlanned = res.nutritionTypePlanned['веган'] + res.nutritionTypePlanned['мясоед'];
    } else if (typeOfEater === 'meatEaters') {
        nutritionTypePlanned = res.nutritionTypePlanned['мясоед'];
    } else if (typeOfEater === 'vegetarian') {
        nutritionTypePlanned = res.nutritionTypePlanned['веган'];
    }

    return [
        { key: '1', mealTimeType: 'завтрак', nutritionTypePlanned, statsFact: statsFact.morning },
        { key: '2', mealTimeType: 'обед', nutritionTypePlanned, statsFact: statsFact.lunch },
        { key: '3', mealTimeType: 'ужин', nutritionTypePlanned, statsFact: statsFact.dinner },
        { key: '4', mealTimeType: 'дожор', nutritionTypePlanned, statsFact: statsFact.night },
        { key: '5', mealTimeType: 'всего', nutritionTypePlanned, statsFact: statsFact.total }
    ];
}

function PublicStatistic() {
    // Фильтр типа питания
    const [typeOfEater, setTypeOfEater] = useState<TypeOfHumans>('all');
    const changeTypeOfEater = (e: RadioChangeEvent) => {
        setTypeOfEater(e.target?.value);
    };
    // Для выбора даты
    const [date, setDate] = useState<dayjsExt.Dayjs | null>(dayjsExt().startOf('date'));
    const changeDate = (value: dayjsExt.Dayjs | null, dateString: string) => {
        setDate(value);
    };
    const convertDateToStringForApi = (date: dayjsExt.Dayjs | null) => {
        if (date === null) {
            return dayjsExt().format('YYYY-MM-DD HH:mm:ss');
        }
        return date.format('YYYY-MM-DD HH:mm:ss');
    };

    // Для выбора диапазона дат
    const [timePeriod, setTimePeriod] = useState([
        dayjsExt().startOf('date'),
        dayjsExt().add(1, 'day').startOf('date')
    ]);
    const changeTimePeriod = useCallback((_, range: [string, string]) => {
        setTimePeriod([dayjsExt(range[0], 'YYYY-MM-DD'), dayjsExt(range[1], 'YYYY-MM-DD')]);
    }, []);

    const dataForTable = handleDataForTable(apiMock[convertDateToStringForApi(date)], typeOfEater);

    return (
        <div>
            <Row>
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
                            <DatePicker
                                locale={locale}
                                defaultValue={date || undefined}
                                onChange={changeDate}
                                format={dateFormat}
                            />
                        </Form.Item>
                    </Form>
                    <TableStats data={dataForTable} />
                    <Divider />
                    <RangePicker locale={locale} format={dateFormat} onChange={changeTimePeriod} />
                    {/* <LinearChart /> */}
                    {/* <ColumnChart /> */}
                </Col>
            </Row>
        </div>
    );
}
export { PublicStatistic };
export type { MealTimeRU };
