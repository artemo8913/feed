import {
    DateField,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    Select,
    Space,
    Table,
    TextField,
    useSelect
} from '@pankod/refine-antd';
import type { DepartmentEntity } from '@feed/api/src/entities/department.entity';
import { useList } from '@pankod/refine-core';
import type { IResourceComponentsProps } from '@pankod/refine-core';
// import { Loader } from '@feed/ui/src/loader';
import { ListBooleanNegative, ListBooleanPositive } from '@feed/ui/src/icons'; // TODO exclude src
import { useMemo, useState } from 'react';
import { Input } from 'antd';
import dayjs from 'dayjs';

import type { VolEntity } from '~/interfaces';

import { dateFormat } from './common';

export const VolList: FC<IResourceComponentsProps> = () => {
    const [searchText, setSearchText] = useState('');

    const { data: volunteers } = useList<VolEntity>({
        resource: 'volunteers'
    });

    const { selectProps: departmentSelectProps } = useSelect<DepartmentEntity>({
        resource: 'departments',
        optionLabel: 'name'
    });

    const filteredData = useMemo(() => {
        return searchText
            ? volunteers?.data.filter((item) => {
                  const searchTextInLowerCase = searchText.toLowerCase();
                  return [
                      item.nickname,
                      item.name,
                      item.lastname,
                      item.departments?.map(({ name }) => name).join(', '),
                      item.active_from ? dayjs(item.active_from).format(dateFormat) : null
                  ].some((text) => {
                      return text?.toLowerCase().includes(searchTextInLowerCase);
                  });
              })
            : volunteers?.data;
    }, [volunteers, searchText]);

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

    const onDepartmentFilter = (value, data) => {
        return data.departments.some((d) => d.id === value);
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
                    dataIndex='lastname'
                    key='lastname'
                    title='Фамилия'
                    render={(value) => <TextField value={value} />}
                    sorter={getSorter('lastname')}
                />
                <Table.Column
                    dataIndex='departments'
                    key='departments'
                    title='Службы'
                    render={(value) => <TextField value={value.map(({ name }) => name).join(', ')} />}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                style={{ minWidth: 300 }}
                                mode='multiple'
                                placeholder='Department'
                                {...departmentSelectProps}
                            />
                        </FilterDropdown>
                    )}
                    onFilter={onDepartmentFilter}
                />
                <Table.Column
                    dataIndex='kitchen'
                    key='kitchen'
                    title='Кухня'
                    render={(value) => <TextField value={value} />}
                    sorter={getSorter('kitchen')}
                />
                <Table.Column
                    dataIndex='active_from'
                    key='active_from'
                    title='От'
                    render={(value) => value && <DateField format={dateFormat} value={value} />}
                    sorter={getSorter('active_from')}
                />
                <Table.Column
                    dataIndex='active_to'
                    key='active_to'
                    title='До'
                    render={(value) => value && <DateField format={dateFormat} value={value} />}
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
                    render={(value) => <div dangerouslySetInnerHTML={{ __html: value }} />}
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
