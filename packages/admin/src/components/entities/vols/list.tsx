import { DateField, DeleteButton, EditButton, List, Space, Table, TextField } from '@pankod/refine-antd';
import type { DepartmentEntity } from '@feed/api/src/entities/department.entity';
import type { IResourceComponentsProps } from '@pankod/refine-core';
import { useList } from '@pankod/refine-core';
// import { Loader } from '@feed/ui/src/loader';
import { ListBooleanNegative, ListBooleanPositive } from '@feed/ui/src/icons'; // TODO exclude src
import Select from 'rc-select';
import { useMemo, useState } from 'react';
import { Input } from 'antd';

import type { VolEntity } from '~/interfaces';

export const VolList: FC<IResourceComponentsProps> = () => {
    const [searchText, setSearchText] = useState('');

    const { data } = useList<VolEntity>({
        resource: 'volunteers'
    });

    const { data: departments } = useList<DepartmentEntity>({
        resource: 'departments'
    });

    const departmentNameById = departments
        ? departments.data.reduce((result, { id, name }) => ({ ...result, [id]: name }), {})
        : {};

    const filteredData = useMemo(() => {
        return searchText
            ? data?.data.filter((item) => {
                  const searchTextInLowerCase = searchText.toLowerCase();
                  return [
                      item.nickname,
                      item.name,
                      item.departments
                          ?.map((id) => departmentNameById[id])
                          .filter((name) => name)
                          .join(', ')
                  ].some((text) => {
                      return text?.toLowerCase().includes(searchTextInLowerCase);
                  });
              })
            : data?.data;
    }, [data, searchText]);

    // const { selectProps } = useSelect<VolEntity>({
    //     resource: 'volunteers'
    // });

    // return <Loader />;

    const getSorter = (field: string) => {
        return (a, b) => {
            if (a[field] < b[field]) {
                return -1;
            }
            if (a[field] > b[field]) {
                return 1;
            }
            return 0;
        };
    };

    return (
        <List>
            <Input value={searchText} onChange={(e) => setSearchText(e.target.value)}></Input>
            <Table dataSource={filteredData} rowKey='id'>
                <Table.Column
                    dataIndex='nickname'
                    key='nickname'
                    title='Позывной'
                    render={(value) => <TextField value={value} />}
                    sorter={getSorter('nickname')}
                />
                <Table.Column
                    dataIndex='name'
                    key='name'
                    title='Имя'
                    render={(value) => <TextField value={value} />}
                    sorter={getSorter('name')}
                />
                <Table.Column
                    dataIndex='departments'
                    key='departments    '
                    title='Службы'
                    render={(value) => (
                        <TextField
                            value={value
                                .map((id) => departmentNameById[id])
                                .filter((name) => name)
                                .join(', ')}
                        />
                    )}
                    // filterDropdown={(props) => (
                    //     <FilterDropdown {...props}>
                    //         <Select
                    //             style={{ minWidth: 200 }}
                    //             mode='multiple'
                    //             placeholder='Department'
                    //             {...selectProps}
                    //         />
                    //     </FilterDropdown>
                    // )}
                />
                <Table.Column
                    dataIndex='active_from'
                    key='active_from'
                    title='От'
                    render={(value) => <DateField value={value} />}
                    sorter={getSorter('active_from')}
                />
                <Table.Column
                    dataIndex='active_to'
                    key='active_to'
                    title='До'
                    render={(value) => <DateField value={value} />}
                    sorter={getSorter('active_to')}
                />
                <Table.Column
                    dataIndex='is_active'
                    key='is_active'
                    title='Активирован'
                    render={(value) => <ListBooleanPositive value={value} />}
                    sorter={getSorter('is_active')}
                />
                <Table.Column
                    dataIndex='is_blocked'
                    key='is_blocked'
                    title='Заблокирован'
                    render={(value) => <ListBooleanNegative value={value} />}
                    sorter={getSorter('is_blocked')}
                />
                <Table.Column
                    dataIndex='comment'
                    key='comment'
                    title='Комментарий'
                    render={(value) => <TextField value={value} />}
                />
                <Table.Column<DepartmentEntity>
                    title='Действия'
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
