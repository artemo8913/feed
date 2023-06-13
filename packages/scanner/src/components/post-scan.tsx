import type { FC } from 'react';
import { memo, useCallback, useContext } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import dayjs from 'dayjs';

import { AppColor, AppContext } from '~/app-context';
import { db, dbIncFeed, FeedType, FeedWithBalance, MealTime } from '~/db';
import { ErrorMsg, GreenAnonCard, GreenCard, isVolExpired, YellowCard } from '~/components/misc/misc';
import { getMealTimeText } from '~/lib/utils';

export const PostScan: FC<{
    qrcode: string;
    closeFeed: () => void;
}> = memo(({ closeFeed, qrcode }) => {
    const vol = useLiveQuery(async () => await db.volunteers.where('qr').equals(qrcode).first(), [qrcode]);
    const volTransactions = useLiveQuery(async () => {
        if (vol) {
            const todayStart = dayjs().subtract(7, 'h').startOf('day').add(7, 'h').unix();
            return await db.transactions
                .where('vol_id')
                .equals(vol.id)
                .filter((transaction) => {
                    return transaction.ts > todayStart;
                })
                .toArray();
        }
    }, [vol]);

    const { kitchenId, mealTime, setColor } = useContext(AppContext);

    console.log({ vol, qrcode });

    const feed = useCallback(
        async (isVegan: boolean | undefined) => {
            if (mealTime) {
                try {
                    await dbIncFeed(vol, mealTime, isVegan);
                    closeFeed();
                } catch (e) {
                    console.error(e);
                }
            }
        },
        [closeFeed, vol]
    );

    const doFeed = useCallback((isVegan?: boolean) => void feed(isVegan), [feed]);

    if (qrcode === 'anon') {
        setColor(AppColor.GREEN);
        return <GreenAnonCard close={closeFeed} doFeed={doFeed} />;
    }

    if (!vol || !volTransactions) {
        if (!qrcode) return <ErrorMsg close={closeFeed} msg='Сбой чтения QR' />;
        return <ErrorMsg close={closeFeed} msg={`Бейдж не найден: ${qrcode}`} />;
    }

    const msg: Array<string> = [];
    let isRed = false;
    if (vol.feed_type !== FeedType.Child && vol.kitchen.toString() !== kitchenId) {
        msg.push(`Кормится на кухне №${vol.kitchen}`);
    }
    if (!vol.is_active) {
        msg.push('Бейдж не активирован в штабе');
    }
    if (vol.is_blocked) {
        isRed = true;
        msg.push('Волонтер заблокирован');
    }
    if (isVolExpired(vol)) {
        msg.push('Даты активности не совпадают');
    }
    if (!FeedWithBalance.has(vol.feed_type)) {
        isRed = true;
        msg.push('НЕТ ПИТАНИЯ, СХОДИ В ИЦ');
    }
    if (mealTime && volTransactions.some((t) => t.mealTime === mealTime)) {
        msg.push(`Волонтер уже получил ${getMealTimeText(mealTime)}`);
        isRed = true;

        // const hasDebt = Object.values(
        //     volTransactions.reduce(
        //         (acc, { mealTime }) => ({
        //             ...acc,
        //             [mealTime]: (acc[mealTime] || 0) + 1
        //         }),
        //         {} as { [mealTime: string]: number }
        //     )
        // ).some((count) => count > 1);

        // if (hasDebt) {
        //     msg.push('Волонтер уже питался сегодня в долг');
        //     isRed = true;
        // }
    }
    if (msg.length && !isRed && volTransactions.some((t) => t.amount)) {
        msg.push('Волонтер уже питался сегодня в долг');
        isRed = true;
    }
    if (vol.feed_type === FeedType.FT2) {
        if (mealTime === MealTime.night) {
            msg.push('Платник не может питаться в дожор');
        }
        if (msg.length > 0) {
            isRed = true;
        }
    }

    if (msg.length > 0) {
        if (isRed) {
            setColor(AppColor.RED);
            return <ErrorMsg close={closeFeed} msg={msg} />;
        } else {
            setColor(AppColor.YELLOW);
            return <YellowCard close={closeFeed} doFeed={doFeed} vol={vol} msg={msg} />;
        }
    }

    setColor(AppColor.GREEN);
    return <GreenCard close={closeFeed} doFeed={doFeed} vol={vol} />;

    // if (FeedWithBalance.has(vol.feed_type)) {
    //     if (vol.balance > 0) {
    //         setColor(AppColor.GREEN);
    //         return <GreenCard close={closeFeed} doFeed={doFeed} vol={vol} />;
    //     } else {
    //     setColor(AppColor.RED);
    //     return <RedCard close={closeFeed} doFeed={doFeed} vol={vol} />;
    // }

    // setColor(AppColor.RED);
    // return <RedCard close={closeFeed} doFeed={doFeed} vol={vol} notice='НЕТ ПИТАНИЯ, СХОДИ В ИЦ' />;
});
PostScan.displayName = 'PostScan';
