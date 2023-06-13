import { Checkbox, Show, Typography } from '@pankod/refine-antd';
import type { IResourceComponentsProps } from '@pankod/refine-core';
import { useShow } from '@pankod/refine-core';

import type { VolEntity } from '~/interfaces';

const { Paragraph, Text, Title } = Typography;

export const VolShow: FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<VolEntity>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Активирован</Title>
            <Checkbox value={record?.is_active} />

            <Title level={5}>Блокирован</Title>
            <Checkbox value={record?.is_blocked} />

            <Title level={5}>Имя</Title>
            <Text>{record?.name}</Text>

            <Title level={5}>Должность</Title>
            <Text>{record?.position}</Text>
        </Show>
    );
};
