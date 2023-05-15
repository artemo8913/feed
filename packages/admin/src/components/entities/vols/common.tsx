import { Checkbox, DatePicker, Form, Input, Select, useSelect } from '@pankod/refine-antd';
import dynamic from 'next/dynamic';

// import { Rules } from '~/components/form';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';

import type { VolEntity, DepartmentEntity, KitchenEntity, FeedTypeEntity, ColorTypeEntity } from '~/interfaces';

export const CreateEdit: FC = () => {
    const { selectProps: leadSelectProps } = useSelect<VolEntity>({
        resource: 'volunteers',
        optionLabel: 'name'
    });

    const { selectProps: departmentSelectProps } = useSelect<DepartmentEntity>({
        resource: 'departments',
        optionLabel: 'name'
    });


    const { selectProps: kitchenSelectProps } = useSelect<KitchenEntity>({
        resource: 'kitchens',
        optionLabel: 'name'
    });

    const { selectProps: feedTypeSelectProps } = useSelect<FeedTypeEntity>({
        resource: 'feed-types',
        optionLabel: 'name'
    });

    const { selectProps: colorTypeSelectProps } = useSelect<ColorTypeEntity>({
        resource: 'colors',
        optionLabel: 'description'
    });

    const getDepartmentIds = (department) => {
        return {
            value: department ? department.map((d) => d.id || d) : department
        };
    };

    const getDateValue = (value) => ({
        value: value ? dayjs(value) : ''
    });

    return (
        <>
            <Form.Item name='is_active' valuePropName='checked'>
                <Checkbox>Активирован</Checkbox>
            </Form.Item>
            <Form.Item name='is_blocked' valuePropName='checked'>
                <Checkbox>Заблокирован</Checkbox>
            </Form.Item>
            <Form.Item label='Позывной' name='nickname'>
                <Input />
            </Form.Item>
            <Form.Item label='Имя' name='name'>
                <Input />
            </Form.Item>
            <Form.Item label='Фамилия' name='lastname'>
                <Input />
            </Form.Item>
            <Form.Item label='От' name='active_from' getValueProps={getDateValue}>
                <DatePicker showTime />
            </Form.Item>
            <Form.Item label='До' name='active_to' getValueProps={getDateValue}>
                <DatePicker showTime />
            </Form.Item>
            <Form.Item label='Шеф' name={['lead', 'id']}>
                <Select {...leadSelectProps} />
            </Form.Item>
            <Form.Item label='Служба / Локация' getValueProps={getDepartmentIds} name='departments'>
                <Select mode='multiple' {...departmentSelectProps} />
            </Form.Item>
            <Form.Item label='Должность' name='position'>
                <Input />
            </Form.Item>
            <Form.Item label='Цвет бейджика' name='color_type'>
                <Select {...colorTypeSelectProps} />
            </Form.Item>
            <Form.Item label='QR' name='qr'>
                <Input />
            </Form.Item>
            <Form.Item label='Тип питания' name='feed_type'>
                <Select {...feedTypeSelectProps} />
            </Form.Item>
            <Form.Item label='Осталось питаний' name='balance'>
                <Input />
            </Form.Item>
            <Form.Item label='Кухня' name='kitchen'>
                <Select {...kitchenSelectProps} />
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
