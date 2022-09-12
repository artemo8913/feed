import { Checkbox, Col, Edit, Form, Input, Row, Typography, useForm } from '@pankod/refine-antd';
import type { IResourceComponentsProps } from '@pankod/refine-core';

import 'react-mde/lib/styles/css/react-mde-all.css';

import type { CompanyEntity } from '~/interfaces';
import { Rules } from '~/components/form/rules';

export const CompanyEdit: FC<IResourceComponentsProps> = () => {
    const { Title } = Typography;
    const { formProps, saveButtonProps } = useForm<CompanyEntity>({
        redirect: 'list'
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout='vertical'>
                <Form.Item label='Name' name='name' rules={Rules.required}>
                    <Input />
                </Form.Item>
                <Form.Item label='Location' name='location' rules={Rules.required}>
                    <Input />
                </Form.Item>
                <Form.Item label='Is Active' name='isActive' valuePropName='checked'>
                    <Checkbox>Active</Checkbox>
                </Form.Item>

                <Title level={5}>Links</Title>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label='Web' name='web'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Linkedin' name='linkedin'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Twitter' name='twitter'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Instagram' name='instagram'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Youtube' name='youtube'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Github' name='github'>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};
