import {action, autorun, observable} from 'mobx';
import CourseModel from '../models/CourseModel';
import {MyTableModel} from '../models/MyTableModel';
import {RootStore} from './RootStore';
import ProjectModel from '../models/ProjectModel';
import {StudentModel} from '../models/StudentModel';
import InstructorModel from '../models/InstructorModel';
import {IMyTableColumnDefinition} from '../components/MyTable/MyTableHead';
import {StudentDialogModel} from '../models/StudentDialogModel';
import {ProjectDialogModel} from '../models/ProjectDialogModel';
import {InstructorDialogModel} from '../models/InstructorDialogModel';

const projectsTableColumns: IMyTableColumnDefinition[] = [{
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

const studentsTableColumns: IMyTableColumnDefinition[] = [{
    id: 'name',
    label: 'Name'
}, {
    id: 'login',
    label: 'Login (Username)'
}, {
    id: 'email',
    label: 'Email'
}];

const instructorsTableColumns: IMyTableColumnDefinition[] = [{
    id: 'name',
    label: 'Name'
}, {
    id: 'login',
    label: 'Login (Username)'
}, {
    id: 'email',
    label: 'Email'
}];

export class CourseScreenStore {
    @observable
    public courseId: string;
    @observable
    public course: CourseModel;
    @observable
    public projectsTable: MyTableModel<ProjectModel>;
    @observable
    public studentsTable: MyTableModel<StudentModel>;
    @observable
    public instructorsTable: MyTableModel<InstructorModel>;

    public readonly rootStore: RootStore;
    public readonly projectDialog: ProjectDialogModel;
    public readonly studentDialog: StudentDialogModel;
    public readonly instructorDialog: InstructorDialogModel;

    constructor(rootStore: RootStore,
                projectDialog: ProjectDialogModel,
                studentDialog: StudentDialogModel,
                instructorDialog: InstructorDialogModel) {
        this.rootStore = rootStore;
        this.projectsTable = new MyTableModel<ProjectModel>(
            'Projects',
            projectsTableColumns,
            []
        );
        this.studentsTable = new MyTableModel<StudentModel>(
            'Students',
            studentsTableColumns,
            []
        );
        this.instructorsTable = new MyTableModel<InstructorModel>(
            'Instructors',
            instructorsTableColumns,
            []
        );
        this.projectDialog = projectDialog;
        this.studentDialog = studentDialog;
        this.instructorDialog = instructorDialog;
        autorun(() => {
            console.log(`CourseScreenStore updating projects table from ProjectsStore`);
            const projects = this.rootStore.projects.projectsById.values();
            this.projectsTable.loadFrom(projects);
        });
        autorun(() => {
            console.log(`CourseScreenStore updating instructors table from InstructorsStore`);
            const instructors = this.rootStore.instructors.instructorsById.values();
            this.instructorsTable.loadFrom(instructors);
        });
        autorun(() => {
            console.log(`CourseScreenStore updating students table from StudentsStore`);
            const students = this.rootStore.students.studentsById.values();
            this.studentsTable.loadFrom(students);
        });
    }

    @action
    public fetch = () => {
        this.rootStore.projects.fetch();
    }

    // Navigates to the course page showing the specified course
    @action
    public openCourse = (courseId: string) => {
        this.courseId = courseId;
        this.course = this.rootStore.courses.coursesById.get(courseId);
        this.rootStore.router.push('/course');
        this.rootStore.projects.fetch();
        this.rootStore.instructors.fetch();
        this.rootStore.students.fetch();
    }

    @action
    public editSelectedProject = () => {
        const selectedProjectId = this.projectsTable.selected[0];
        const selectedProject = this.rootStore.projects.projectsById.get(selectedProjectId);
        this.projectDialog.openToEdit(selectedProject);
    }

    @action
    public addProject = () => {
        console.log(`CourseScreenStore addProject invoked. courseId: ${this.courseId}.`);
        this.projectDialog.openToAdd(this.courseId);
    }

    @action
    public deleteSelectedProjects = () => {
        const ids = this.projectsTable.selected;
        console.log(`CourseScreenStore deleteSelectedProjects. ids: ${JSON.stringify(ids)}.`);
        this.rootStore.projects.delete(ids);
    }

    @action
    public openSelectedProject = () => {

    }

    @action
    public editSelectedStudent = () => {
        const selectedStudentId = this.studentsTable.selected[0];
        const selectedStudent = this.rootStore.students.studentsById.get(selectedStudentId);
        this.studentDialog.openToEdit(selectedStudent);
    }

    @action
    public addStudent = () => {
        this.studentDialog.openToAdd(this.courseId);
    }

    @action
    public deleteSelectedStudents = () => {
        const ids = this.studentsTable.selected;
        this.rootStore.students.delete(ids);
    }

    @action
    public editSelectedInstructor = () => {
        const selectedInstructorId = this.instructorsTable.selected[0];
        const selectedInstructor = this.rootStore.instructors.instructorsById.get(selectedInstructorId);
        this.instructorDialog.openToEdit(selectedInstructor);
    }

    @action
    public addInstructor = () => {
        this.instructorDialog.openToAdd(this.courseId);
    }

    @action
    public deleteSelectedInstructors = () => {
        const ids = this.instructorsTable.selected;
        this.rootStore.instructors.delete(ids);
    }
}
