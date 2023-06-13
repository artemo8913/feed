import { Checkbox, Create, DatePicker, Form, Input, Select, useForm, useSelect } from '@pankod/refine-antd';
import type { IResourceComponentsProps } from '@pankod/refine-core';
import { useCallback, useEffect, useState } from 'react';
import { ulid } from 'ulid';

import type { FeedTransactionEntity, KitchenEntity, VolEntity } from '~/interfaces';
import { Rules } from '~/components/form/rules';

const mealTimeSelectProps = {
    options: [
        { value: 'breakfast', label: 'Завтрак' },
        { value: 'lunch', label: 'Обед' },
        { value: 'dinner', label: 'Ужин' },
        { value: 'night', label: 'Дожор' }
    ]
};

export const FeedTransactionCreate: FC<IResourceComponentsProps> = () => {
    const { form, formProps, saveButtonProps } = useForm<FeedTransactionEntity>();

    const { selectProps: volSelectProps } = useSelect<VolEntity>({
        resource: 'volunteers',
        optionLabel: 'nickname'
    });

    const { selectProps: kitchenSelectProps } = useSelect<KitchenEntity>({
        resource: 'kitchens',
        optionLabel: 'name'
    });

    useEffect(() => {
        form.setFieldValue('amount', 1);
        form.setFieldValue('is_vegan', false);
    }, []);

    const onTimeChange = useCallback(
        (value) => {
            form.setFieldValue('ulid', value ? ulid(value.unix()) : undefined);
        },
        [form]
    );

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout='vertical'>
                <Form.Item label='id' name='ulid' hidden>
                    <Input />
                </Form.Item>
                <Form.Item label='Время' name='dtime' rules={Rules.required}>
                    <DatePicker showTime style={{ width: '100%' }} onChange={onTimeChange} />
                </Form.Item>
                <Form.Item label='Прием пищи' name='meal_time' rules={Rules.required}>
                    <Select {...mealTimeSelectProps} />
                </Form.Item>
                <Form.Item label='Волонтер' name='volunteer'>
                    <Select {...volSelectProps} />
                </Form.Item>
                <Form.Item label='Веган' name='is_vegan' valuePropName='checked'>
                    <Checkbox />
                </Form.Item>
                <Form.Item label='Кол-во' name='amount' rules={Rules.required}>
                    <Input type='number' />
                </Form.Item>
                <Form.Item label='Кухня' name='kitchen' rules={Rules.required}>
                    <Select {...kitchenSelectProps} />
                </Form.Item>
            </Form>
        </Create>
    );
};
