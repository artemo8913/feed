import type { FC } from 'react';
import { memo, useCallback, useContext } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { AppColor, AppContext } from '~/app-context';
import { db, dbIncFeed, FeedWithBalance } from '~/db';
import { ErrorMsg, GreenCard, isVolExpired, RedCard } from '~/components/misc/misc';

export const PostScan: FC<{
    qrcode: string;
    closeFeed: () => void;
}> = memo(({ closeFeed, qrcode }) => {
    const vol = useLiveQuery(async () => await db.volunteers.where('qr').equals(qrcode).first(), [qrcode]);
    const { kitchenId, mealTime, setColor } = useContext(AppContext);

    console.log({ vol, qrcode });

    const feed = useCallback(async () => {
        if (vol && mealTime) {
            try {
                await dbIncFeed(vol, mealTime);
                closeFeed();
            } catch (e) {
                console.error(e);
            }
        }
    }, [closeFeed, vol]);

    const doFeed = useCallback(() => void feed(), [feed]);

    if (!vol) {
        if (!qrcode) return <ErrorMsg close={closeFeed} msg='Сбой чтения QR' />;
        return <ErrorMsg close={closeFeed} msg={`Бейдж не найден: ${qrcode}`} />;
    }

    if (!vol.is_active || vol.is_blocked || isVolExpired(vol) || vol.kitchen.toString() !== kitchenId) {
        const msg: Array<string> = [];
        if (vol.kitchen.toString() !== kitchenId) {
            msg.push(`Кормится на кухне ${vol.kitchen}`);
        }
        if (!vol.is_active) {
            msg.push('Бейдж не активирован в штабе');
        }
        if (vol.is_blocked) {
            msg.push('Волонтер заблокирован');
        }
        if (isVolExpired(vol)) {
            msg.push('Даты активности не совпадают');
        }

        setColor(AppColor.RED);

        return <ErrorMsg close={closeFeed} msg={msg} />;
    }

    if (FeedWithBalance.has(vol.feed_type)) {
        if (vol.balance > 0) {
            setColor(AppColor.GREEN);
            return <GreenCard close={closeFeed} doFeed={doFeed} vol={vol} />;
        }
        setColor(AppColor.RED);
        return <RedCard close={closeFeed} doFeed={doFeed} vol={vol} />;
    }

    setColor(AppColor.RED);
    return <RedCard close={closeFeed} doFeed={doFeed} vol={vol} notice='НЕТ ПИТАНИЯ, СХОДИ В ИЦ' />;
});
PostScan.displayName = 'PostScan';
