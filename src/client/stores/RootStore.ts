import {AuthStore} from './AuthStore';
import {HomeStore} from './HomeStore';
import {RouterStore} from 'mobx-react-router';
import {CoursesStore} from './CoursesStore';
import {CourseDialogModel} from '../models/CourseDialogModel';
import {CourseScreenStore} from './CourseScreenStore';
import {StudentDialogModel} from '../models/StudentDialogModel';
import {ProjectDialogModel} from '../models/ProjectDialogModel';
import {InstructorDialogModel} from '../models/InstructorDialogModel';
import {ProjectsStore} from './ProjectsStore';
import {StudentsStore} from './StudentsStore';
import {InstructorsStore} from './InstructorsStore';

export class RootStore {
    public auth: AuthStore;
    public home: HomeStore;
    public router: RouterStore;
    public courses: CoursesStore;
    public courseScreen: CourseScreenStore;
    public projects: ProjectsStore;
    public students: StudentsStore;
    public instructors: InstructorsStore;

    constructor() {
        // Domain stores
        this.auth = new AuthStore(this);
        this.courses = new CoursesStore(this);
        this.router = new RouterStore();
        this.projects = new ProjectsStore(this);
        this.instructors = new InstructorsStore(this);
        this.students = new StudentsStore(this);
        // UI stores
        this.home = new HomeStore(this, new CourseDialogModel(this.courses));
        this.courseScreen = new CourseScreenStore(
            this,
            new ProjectDialogModel(this.projects),
            new StudentDialogModel(this.students),
            new InstructorDialogModel(this.instructors));
    }
}