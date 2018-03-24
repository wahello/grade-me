import * as _ from 'lodash';
import {observable, computed, action, autorun} from 'mobx';
import CourseModel from '../models/CourseModel';
import {RootStore} from './RootStore';
import {IMyTableRowData, MyTableModel} from '../models/MyTableModel';
import {IMyTableColumnDefinition} from '../components/MyTable/MyTableHead';
import {CourseDialogModel} from '../models/CourseDialogModel';

const coursesTableColumns: IMyTableColumnDefinition[] = [{
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name'
}, {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description'
}];

export class HomeStore {
    @observable
    public coursesTable: MyTableModel<CourseModel>;

    public courseDialog: CourseDialogModel;

    private rootStore: RootStore;

    constructor(rootStore: RootStore, courseDialog: CourseDialogModel) {
        this.rootStore = rootStore;
        this.coursesTable = new MyTableModel<CourseModel>(
            'Courses',
            coursesTableColumns,
            _.values(rootStore.courses.coursesById)
        );
        autorun(() => {
            console.log('Updating courses table from CoursesStore');
            const courses = this.rootStore.courses.coursesById.values();
            this.coursesTable.loadFrom(courses);
        });
        this.courseDialog = courseDialog;
    }

    @action
    public fetch = () => {
        if (this.coursesTable.data.length === 0) {
            this.rootStore.courses.fetch();
        }
    }

    @action
    public editSelectedCourse = () => {
        const selectedCourseId = this.coursesTable.selected[0];
        const selectedCourse = this.rootStore.courses.coursesById.get(selectedCourseId);
        this.courseDialog.openToEdit(selectedCourse);
    }

    @action
    public addCourse = () => {
        this.courseDialog.openToAdd();
    }

    @action
    public deleteSelectedCourses = () => {
        const ids = this.coursesTable.selected;
        this.rootStore.courses.delete(ids);
    }

    @action
    public openSelectedCourse = () => {
        const id = this.coursesTable.selected[0];
        this.rootStore.courseScreen.openCourse(id);
    }
}