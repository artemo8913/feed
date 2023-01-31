import { Checkbox, Form, Input, Select, useSelect } from '@pankod/refine-antd';
import { Rules } from '~/components/form';
import type { CompanyEntity } from '@feed/api/dist/src/entities/company.entity';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const CreateEdit: FC = () => {
    const { selectProps } = useSelect<CompanyEntity>({
        resource: 'companies',
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
            <Form.Item label='Company' name={['company', 'id']} rules={Rules.required}>
                <Select {...selectProps} />
            </Form.Item>
            <Form.Item label='Должность' name='position'>
                <Input />
            </Form.Item>
            <Form.Item label='Телефон' name='phone'>
                <Input type='phone' />
            </Form.Item>
            <Form.Item label='Комментарий' name='comment'>
                <ReactQuill />
            </Form.Item>
        </>
    );
};
