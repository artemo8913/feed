import { Checkbox, Form, Input, Select, useSelect } from '@pankod/refine-antd';
import dynamic from 'next/dynamic';
import type { VolEntity } from '@feed/api/src/entities/vol.entity';

// import { Rules } from '~/components/form';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import type { DepartmentEntity } from '~/interfaces';

export const CreateEdit: FC = () => {
    const { selectProps: leadSelectProps } = useSelect<VolEntity>({
        resource: 'vols',
        optionLabel: 'name'
    });

    const { selectProps: departmentSelectProps } = useSelect<DepartmentEntity>({
        resource: 'departments',
        optionLabel: 'name'
    });

    const getDepartmentIds = (department) => {
        return {
            value: department ? department.map((d) => d.id || d) : department
        };
    };

    return (
        <>
            <Form.Item name='isActive' valuePropName='checked'>
                <Checkbox>Активирован</Checkbox>
            </Form.Item>
            <Form.Item name='isBlocked' valuePropName='checked'>
                <Checkbox>Заблокирован</Checkbox>
            </Form.Item>
            <Form.Item label='Имя' name='name'>
                <Input />
            </Form.Item>
            <Form.Item label='Позывной' name='nick'>
                <Input />
            </Form.Item>
            <Form.Item label='От' name='activeFrom'>
                <Input type='datetime-local' />
            </Form.Item>
            <Form.Item label='До' name='activeTo'>
                <Input type='datetime-local' />
            </Form.Item>
            <Form.Item label='Шеф' name={['lead', 'id']}>
                <Select {...leadSelectProps} />
            </Form.Item>
            <Form.Item label='Служба / Локация' getValueProps={getDepartmentIds} name='department'>
                <Select mode='multiple' {...departmentSelectProps} />
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
