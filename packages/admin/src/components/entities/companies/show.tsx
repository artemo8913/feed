import { Show, Typography } from '@pankod/refine-antd';
import { useShow } from '@pankod/refine-core';

import type { CompanyEntity } from '~/interfaces';

const { Paragraph, Text, Title } = Typography;

export const CompanyShow: FC<{
    id: string;
}> = ({ id }) => {
    const { queryResult } = useShow<CompanyEntity>({ id });
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Name</Title>
            <Text>{record?.name}</Text>
            <Title level={5}>Location</Title>
            <Text>{record?.location}</Text>
            <Title level={5}>Is Active</Title>
            <Text>{record?.isActive ? 'Active' : 'Passive'}</Text>

            <Title level={4}>Links</Title>
            <Paragraph>
                <strong>Web: </strong> {record?.web || '-'}
            </Paragraph>
        </Show>
    );
};
