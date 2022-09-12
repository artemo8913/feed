import {
    Button,
    DeleteButton,
    Drawer,
    EditButton,
    Form,
    getDefaultSortOrder,
    Input,
    List,
    SaveButton,
    ShowButton,
    Space,
    Table,
    TagField,
    TextField,
    useEditableTable
} from '@pankod/refine-antd';
import type { IResourceComponentsProps } from '@pankod/refine-core';
import { useShow } from '@pankod/refine-core';
import { useMemo, useState } from 'react';

import type { CompanyEntity } from '~/interfaces';

import { CompanyShow } from './show';

const formInlineEditStyle = { margin: 0 };

export const CompanyList: FC<IResourceComponentsProps> = () => {
    const [visibleShowDrawer, setVisibleShowDrawer] = useState<boolean>(false);
    const { /*queryResult,*/ setShowId, showId } = useShow<CompanyEntity>();

    const {
        cancelButtonProps,
        // editButtonProps,
        formProps,
        isEditing,
        saveButtonProps,
        setId: setEditId,
        sorter,
        tableProps
    } = useEditableTable<CompanyEntity>({
        initialSorter: [
            {
                field: 'id',
                order: 'desc'
            }
        ]
    });

    const rowActions = useMemo(
        () => (record) => ({
            onClick: (event: any) => {
                if (event.target.nodeName === 'TD') {
                    setEditId && setEditId(record.id);
                }
            }
        }),
        [setEditId]
    );

    return (
        <>
            <List>
                <Form {...formProps}>
                    <Table {...tableProps} rowKey='id' onRow={rowActions}>
                        <Table.Column<CompanyEntity>
                            dataIndex='name'
                            key='name'
                            title='Name'
                            render={(value, record) => {
                                if (isEditing(record.id)) {
                                    return (
                                        <Form.Item initialValue={value} name='name' style={formInlineEditStyle}>
                                            <Input />
                                        </Form.Item>
                                    );
                                }
                                return <TextField value={value} />;
                            }}
                            defaultSortOrder={getDefaultSortOrder('name', sorter)}
                            sorter
                        />
                        <Table.Column<CompanyEntity>
                            dataIndex='location'
                            key='location'
                            title='Location'
                            render={(value) => <TextField value={value} />}
                            defaultSortOrder={getDefaultSortOrder('location', sorter)}
                            sorter
                        />
                        <Table.Column<CompanyEntity>
                            dataIndex='isActive'
                            key='isActive'
                            title='Is Active'
                            render={(value) => <TagField value={value} />}
                            defaultSortOrder={getDefaultSortOrder('status', sorter)}
                            sorter
                        />
                        <Table.Column<CompanyEntity>
                            title='Actions'
                            dataIndex='actions'
                            render={(_, record) => {
                                if (isEditing(record.id)) {
                                    return (
                                        <Space>
                                            <SaveButton {...saveButtonProps} hideText size='small' />
                                            <Button {...cancelButtonProps} size='small'>
                                                Cancel
                                            </Button>
                                        </Space>
                                    );
                                }
                                return (
                                    <Space>
                                        <EditButton hideText size='small' recordItemId={record.id} />
                                        <DeleteButton hideText size='small' recordItemId={record.id} />
                                        <ShowButton
                                            hideText
                                            size='small'
                                            recordItemId={record.id}
                                            onClick={() => {
                                                setShowId(record.id);
                                                setVisibleShowDrawer(true);
                                            }}
                                        />
                                    </Space>
                                );
                            }}
                        />
                    </Table>
                </Form>
            </List>
            <Drawer visible={visibleShowDrawer} onClose={() => setVisibleShowDrawer(false)} width='50%'>
                <CompanyShow id={showId as string} />
            </Drawer>
        </>
    );
};
