import { default as dayjsExt } from '~/dateHelper';

export interface IFactMockData {
    date: dayjsExt.Dayjs;
    value: number;
    category: string;
}

export const factDataMock: Array<IFactMockData> = [
    {
        date: dayjsExt(),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(1, 'day'),
        value: 8,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(2, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(3, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(4, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    },
    {
        date: dayjsExt().add(5, 'day'),
        value: 6,
        category: 'Фактически накормлено, чел'
    }
];
