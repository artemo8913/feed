import React, { useState } from 'react';

import { axios } from '~/authProvider';
import { NEW_API_URL } from '~/const';

const apiUrl = NEW_API_URL;

import { Button, List } from '@pankod/refine-antd';

export const Sync: FC = () => {
    const [disabled, setDisabled] = useState(false);
    const syncNotion = async () => {
        setDisabled(true);
        try {
            await axios.post(`${apiUrl}/notion-sync`);
        } catch (e) {
            alert('При синхронизации возникла ошибка');
        } finally {
            setDisabled(false);
        }
    };
    const onClick = () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        syncNotion();
    };
    return (
        <List>
            <Button disabled={disabled} onClick={onClick}>
                Синхронизация с Notion
            </Button>
        </List>
    );
};
