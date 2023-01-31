import { Checkbox, Form, Input, Select, useSelect } from '@pankod/refine-antd';
import type { VolEntity } from '@feed/api/dist/src/entities/vol.entity';

import { Rules } from '~/components/form';

export const CreateEdit: FC = () => {
    const { selectProps: leadSelectProps } = useSelect<VolEntity>({
        resource: 'vols',
        optionLabel: 'name'
    });

    const { selectProps: locationSelectProps } = useSelect<VolEntity>({
        resource: 'locations',
        optionLabel: 'name'
    });

    return (
        <>
            <Form.Item label='Активирован' name='isActive' valuePropName='checked'>
                <Checkbox>Активирован</Checkbox>
            </Form.Item>
            <Form.Item label='Блокирован' name='isBlocked' valuePropName='checked'>
                <Checkbox>Блокирован</Checkbox>
            </Form.Item>
            <Form.Item label='Имя' name='name'>
                <Input />
            </Form.Item>
            <Form.Item label='Зов' name='nick'>
                <Input />
            </Form.Item>
            <Form.Item label='От' name='activeFrom'>
                <Input type='date' />
            </Form.Item>
            <Form.Item label='До' name='activeTo'>
                <Input type='date' />
            </Form.Item>
            <Form.Item label='Lead' name={['lead', 'id']} rules={Rules.required}>
                <Select {...leadSelectProps} />
            </Form.Item>
            <Form.Item label='Location' name={['location', 'id']} rules={Rules.required}>
                <Select {...locationSelectProps} />
            </Form.Item>
            <Form.Item label='Должность' name='position'>
                <Input />
            </Form.Item>
            <Form.Item label='Телефон' name='phone'>
                <Input type='phone' />
            </Form.Item>
        </>
    );
};
