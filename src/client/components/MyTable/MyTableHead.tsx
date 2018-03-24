import * as React from 'react';
import {Dictionary} from 'lodash';
import * as _ from 'lodash';
import {TableHead, TableRow, TableCell, TableSortLabel} from 'material-ui';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';

export interface IMyTableColumnDefinition {
    id: string;
    numeric?: boolean;
    disablePadding?: boolean;
    label: string;
    sortFunction?: (a: any, b: any) => number;
}

export type MyTableSortOrder = 'asc' | 'desc';

export interface IMyTableHeadProps {
    columnData: IMyTableColumnDefinition[];
    onSelectAllClick: (checked: boolean) => void;
    order: MyTableSortOrder;
    orderBy: string;
    numSelected: number;
    rowCount: number;
    onSort: (columnId: string, event: React.MouseEvent<any>) => void;
}

export class MyTableHead extends React.PureComponent<IMyTableHeadProps> {
    private sortHandlers: Dictionary<React.MouseEventHandler<any>>;

    constructor(props: IMyTableHeadProps) {
        super(props);
        this.sortHandlers = this.buildSortHandlers(props);
    }

    public componentWillReceiveProps(props: IMyTableHeadProps) {
        if (this.props.columnData !== props.columnData) {
            this.sortHandlers = this.buildSortHandlers(props);
        }
    }

    public render() {
        const {columnData, onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding='checkbox'>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={this.onSelectAll}
                        />
                    </TableCell>
                    {columnData.map(column => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === column.id ? order : false}
                            >
                                <Tooltip
                                    title='Sort'
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        onClick={this.sortHandlers[column.id]}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
        );
    }

    private buildSortHandlers = (props: IMyTableHeadProps) => {
        const pairs = props.columnData
            .map(column => [
                column.id,
                (event: React.MouseEvent<any>) => this.props.onSort(column.id, event)
            ]);
        return _.fromPairs(pairs);
    }

    private onSelectAll = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.props.onSelectAllClick(checked);
    }
}