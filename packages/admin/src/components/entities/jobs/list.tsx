import {
    DeleteButton,
    EditButton,
    FilterDropdown,
    getDefaultSortOrder,
    List,
    Space,
    Table,
    TagField,
    TextField,
    useSelect,
    useTable
} from '@pankod/refine-antd';
import type { IResourceComponentsProps } from '@pankod/refine-core';
import Select from 'rc-select';

import type { CompanyEntity, DepartmentEntity } from '~/interfaces';

export const JobList: FC<IResourceComponentsProps> = () => {
    const { sorter, tableProps } = useTable<DepartmentEntity>({
        initialSorter: [
            {
                field: 'id',
                order: 'desc'
            }
        ]
    });

    const { selectProps: companySelectProps } = useSelect<CompanyEntity>({
        resource: 'companies'
    });

    return (
        <List>
            <Table {...tableProps} rowKey='id'>
                <Table.Column
                    dataIndex={['company', 'name']}
                    title='Company'
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                style={{ minWidth: 200 }}
                                mode='multiple'
                                placeholder='Select Company'
                                {...companySelectProps}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    dataIndex='title'
                    key='title'
                    title='Title'
                    render={(value) => <TextField value={value} />}
                    defaultSortOrder={getDefaultSortOrder('title', sorter)}
                    sorter
                />
                <Table.Column
                    dataIndex='isActive'
                    key='isActive'
                    title='Is Active'
                    render={(value) => <TagField value={value} />}
                    defaultSortOrder={getDefaultSortOrder('status', sorter)}
                    sorter
                />
                <Table.Column<DepartmentEntity>
                    title='Actions'
                    dataIndex='actions'
                    render={(_, record) => (
                        <Space>
                            <EditButton hideText size='small' recordItemId={record.id} />
                            <DeleteButton hideText size='small' recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
