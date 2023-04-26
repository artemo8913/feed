import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    Space,
    Table,
    TextField,
} from '@pankod/refine-antd';
import type { DepartmentEntity } from '@feed/api/src/entities/department.entity';
import { IResourceComponentsProps, useList } from '@pankod/refine-core';
// import { Loader } from '@feed/ui/src/loader';
import { ListBooleanNegative, ListBooleanPositive } from '@feed/ui/src/icons'; // TODO exclude src
import Select from 'rc-select';

import type { VolEntity } from '~/interfaces';
import { useState } from 'react';

import { Input } from 'antd';
import { useMemo } from 'react';

export const VolList: FC<IResourceComponentsProps> = () => {
    const [searchText, setSearchText] = useState('');

    const { data } = useList<VolEntity>({
        resource: 'vols'
    });

    const filteredData = useMemo(() => {
        return searchText ? data?.data.filter(item => {
            const searchTextInLowerCase = searchText.toLowerCase();
            return [item.nick, item.name, item.department?.map(d => d.name).join(', ')].some((text) => {
                return text?.toLowerCase().includes(searchTextInLowerCase);
            })
        }) : data?.data;
    }, [data, searchText]);

    // const { selectProps } = useSelect<VolEntity>({
    //     resource: 'vols'
    // });

    // return <Loader />;

    const getSorter = (field: string) => {
        return (a, b) => {
            if (a[field] < b[field]) {return -1;}
            if (a[field] > b[field]) {return 1;}
            return 0;
        }
    }

    return (
        <List>
            <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} ></Input>
            <Table dataSource={filteredData} rowKey='id'>
                <Table.Column
                    dataIndex='nick'
                    key='nick'
                    title='Позывной'
                    render={(value) => <TextField value={value} />}
                    sorter={getSorter('nick')}
                />
                <Table.Column
                    dataIndex='name'
                    key='name'
                    title='Имя'
                    render={(value) => <TextField value={value} />}
                    sorter={getSorter('name')}
                />
                <Table.Column
                    dataIndex='department'
                    key='department'
                    title='Службы'
                    render={(value) => <TextField value={value.map(v => v.name).join(', ')} />}
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
                    dataIndex='activeFrom'
                    key='activeFrom'
                    title='От'
                    render={(value) => <DateField value={value} />}
                    sorter={getSorter('activeFrom')}
                />
                <Table.Column
                    dataIndex='activeTo'
                    key='activeTo'
                    title='До'
                    render={(value) => <DateField value={value} />}
                    sorter={getSorter('activeTo')}
                />
                <Table.Column
                    dataIndex='isActive'
                    key='isActive'
                    title='Активирован'
                    render={(value) => <ListBooleanPositive value={value} />}
                    sorter={getSorter('isActive')}
                />
                <Table.Column
                    dataIndex='isBlocked'
                    key='isBlocked'
                    title='Заблокирован'
                    render={(value) => <ListBooleanNegative value={value} />}
                    sorter={getSorter('isBlocked')}
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
