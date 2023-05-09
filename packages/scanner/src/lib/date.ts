import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import duration from 'dayjs/plugin/duration';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
import toObject from 'dayjs/plugin/toObject';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(dayOfYear);
dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(duration);
dayjs.extend(toObject);
dayjs.extend(utc);

export const DATE_FORMAT = 'YYYY-MM-DD';

export type MealTime = {
    breakfast: dayjs.Dayjs;
    lunch: dayjs.Dayjs;
    dinner: dayjs.Dayjs;
    night: dayjs.Dayjs;
};

export const getToday = (): string => {
    const now = dayjs();
    if (now.isAfter(dayjs().startOf('day').add(7, 'h'))) {
        return now.startOf('day').format(DATE_FORMAT);
    } else {
        return now.startOf('day').subtract(1, 'day').format(DATE_FORMAT);
    }
};

export const getMealTime = (): MealTime => {
    const today = getToday();
    return {
        breakfast: dayjs(today).add(7, 'h'),
        lunch: dayjs(today).add(14, 'h'),
        dinner: dayjs(today).add(18, 'h'),
        night: dayjs(today).add(22, 'h')
    };
};
