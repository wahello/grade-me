import * as React from 'react';
import * as _ from 'lodash';
import {MyTableModel} from '../../models/MyTableModel';
import {WithStyles, withStyles, Theme, StyleRulesCallback} from 'material-ui/styles';
import {
    Paper,
    Table, TableBody, TableRow, TableCell,
    Checkbox
} from 'material-ui';
import {TableFooter, TablePagination} from 'material-ui/Table';
import {MyTableToolbar} from './MyTableToolbar';
import {MyTableHead} from './MyTableHead';
import {observer} from 'mobx-react';

export interface IMyTableProps {
    name: string;
    model: MyTableModel<any>;
    onEdit?: React.MouseEventHandler<HTMLButtonElement>;
    onAdd?: React.MouseEventHandler<HTMLButtonElement>;
    onDelete?: React.MouseEventHandler<HTMLButtonElement>;
    onOpen?: React.MouseEventHandler<HTMLButtonElement>;
}

interface IMyTableState {

}

type MyTablePropsWithStyles = IMyTableProps & WithStyles<'root' | 'tableWrapper' | 'table'>;

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    table: {
        minWidth: 800
    }
});

@observer
class MyTableWithStyles extends React.Component<MyTablePropsWithStyles, IMyTableState> {
    constructor(props: MyTablePropsWithStyles) {
        super(props);
    }

    public render() {
        const {name, classes, model, onEdit, onAdd, onDelete, onOpen} = this.props;
        const {
            title, data, orderBy, selected, rowsPerPage,
            page, columnDefinitions, order
        } = this.props.model;
        console.log(`Rendering MyTable ${name} with data: ${JSON.stringify(data)}.`);
        const currentPageRows = this.props.model.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        return (
            <Paper className={classes.root}>
                <MyTableToolbar
                    title={title}
                    numSelected={selected.length}
                    onEdit={onEdit}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    onOpen={onOpen}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <MyTableHead
                            columnData={model.columnDefinitions}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={model.selectAll}
                            onSort={model.sort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {currentPageRows.map(row => {
                                const isSelected = model.isSelected(row.id);
                                return (
                                    <TableRow
                                        data-row-id={row.id}
                                        hover={true}
                                        onClick={this.onRowClick}
                                        role='checkbox'
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isSelected}
                                    >
                                        <TableCell
                                            data-row-id={row.id}
                                            padding='checkbox'
                                            onClick={this.onCheckboxClick}
                                        >
                                            <Checkbox checked={isSelected}/>
                                        </TableCell>
                                        {columnDefinitions.map(c => {
                                            const key = `${row.id}_${c.id}`;
                                            return (
                                                <TableCell
                                                    key={key}
                                                    padding={c.disablePadding ? 'none' : 'default'}
                                                    numeric={!!c.numeric}
                                                >
                                                    {row[c.id]}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    colSpan={model.columnDefinitions.length}
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.onPageChange}
                                    onChangeRowsPerPage={this.onRowsPerPageChange}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </Paper>
        );
    }

    private onRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
        const htmlRow = event.currentTarget as HTMLTableRowElement;
        const rowId = htmlRow.attributes.getNamedItem('data-row-id').value;
        this.props.model.select(rowId);
    }

    private onPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        this.props.model.setPage(page);
    }

    private onRowsPerPageChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = e => {
        this.props.model.setRowsPerPage(parseInt(e.target.value, 10));
    }

    private onCheckboxClick: React.MouseEventHandler<HTMLTableCellElement> = event => {
        const htmlCell = event.currentTarget as HTMLTableCellElement;
        const rowId = htmlCell.attributes.getNamedItem('data-row-id').value;
        this.props.model.switchSelection(rowId);
        event.stopPropagation();
    }
}

const MyTable = withStyles(styles)<IMyTableProps>(MyTableWithStyles);
export {MyTable};