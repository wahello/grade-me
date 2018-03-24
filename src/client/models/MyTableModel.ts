import {Dictionary} from 'lodash';
import * as _ from 'lodash';
import {IMyTableColumnDefinition, MyTableSortOrder} from '../components/MyTable/MyTableHead';
import {action, IObservableArray, observable} from 'mobx';
import {ObservableArray} from 'mobx/lib/types/observablearray';

export const DEFAULT_ROWS_PER_PAGE = 10;

export interface IMyTableRowData {
    id: string;
}

export class MyTableModel<TData extends IMyTableRowData> {
    @observable
    public title: string;
    @observable
    public order: MyTableSortOrder;
    @observable
    public orderBy: string;
    @observable
    public selected = [] as IObservableArray<string>;
    @observable
    public data = [] as IObservableArray<TData>;
    @observable
    public page: number;
    @observable
    public rowsPerPage: number;
    @observable
    public columnDefinitions: IMyTableColumnDefinition[];
    private columnDefinitionsById: Dictionary<IMyTableColumnDefinition>;

    constructor(title: string, columnDefinitions: IMyTableColumnDefinition[], data: TData[] = []) {
        this.title = title;
        this.columnDefinitions = columnDefinitions;
        this.columnDefinitionsById = _.keyBy(columnDefinitions, x => x.id);
        this.data.push(...data);
        this.page = 0;
        this.rowsPerPage = DEFAULT_ROWS_PER_PAGE;
    }

    @action
    public sort = (orderBy: string) => {
        let order: MyTableSortOrder = 'desc';
        if (!orderBy) {
            return;
        }
        if (this.orderBy === orderBy) {
            order = this.order === 'desc' ? 'asc' : 'desc';
        }
        const columnDefinition = this.columnDefinitionsById[orderBy];
        const sortFunction = columnDefinition.sortFunction ||
            ((a: any, b: any) => (a[orderBy] < b[orderBy]) ? -1 : 1);
        let data: TData[] = this.data.sort(sortFunction);
        if (order === 'desc') {
            data = data.reverse();
        }
        this.order = order;
        this.orderBy = orderBy;
        this.data.replace(data);
    }

    @action
    public selectAll = (checked: boolean) => {
        if (checked) {
            this.selected.replace(this.data.map(x => x.id));
        } else {
            this.selected.clear();
        }
    }

    @action
    public select(id: string) {
        this.selected.replace([id]); // TODO more selection options
    }

    @action
    public switchSelection = (id: string) => {
        const idx = this.selected.indexOf(id);
        if (idx === -1) {
            this.selected.push(id);
        } else {
            this.selected.remove(id);
        }
    }

    @action
    public setPage(page: number) {
        this.page = page;
    }

    @action
    public setRowsPerPage(rowsPerPage: number) {
        this.rowsPerPage = rowsPerPage;
    }

    @action
    public loadFrom(data: TData[]) {
        this.data.replace(data);
        this.sort(this.orderBy); // TODO optimize
    }

    public isSelected(id) {
        return this.selected.indexOf(id) !== -1;
    }
}