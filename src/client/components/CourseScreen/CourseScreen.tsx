import * as React from 'react';
import {AppBar, IconButton} from 'material-ui';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import {Theme, withStyles, WithStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/es/Button';
import {History} from 'history';
import {ProjectsTableContainer} from './ProjectsTableContainer';
import {ProjectDialogContainer} from './ProjectDialogContainer';
import {UserPanelContainer} from '../Home/UserPanelContainer';
import CourseModel from '../../models/CourseModel';
import {observer} from 'mobx-react';
import {InstructorsTableContainer} from './InstructorsTableContainer';
import {StudentsTableContainer} from './StudentsTableContainer';
import {InstructorDialogContainer} from './InstructorDialogContainer';
import {StudentDialogContainer} from './StudentDialogContainer';

const logoImg = require('../../../../assets/images/logo.png');

const styles = (theme: Theme) => ({
    root: {
        width: '100%'
    },
    flex: {
        flex: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
});

export interface ICourseScreenProps {
    courseId: string;
    course: CourseModel;
    history: History;
    onFetch: () => void;
}

type CourseScreenPropsWithStyles = ICourseScreenProps & WithStyles<'root' | 'flex' | 'menuButton'>;

@observer
class CourseScreen extends React.Component<CourseScreenPropsWithStyles, {}> {
    constructor(props: CourseScreenPropsWithStyles) {
        super(props);
    }

    public componentDidMount() {
        console.log('CourseScreen did mount. Fetching data.');
        this.props.onFetch();
    }

    public componentWillReceiveProps(props: CourseScreenPropsWithStyles) {
        if (!props.courseId) {
            console.log('courseId is missing. navigating to home screen.');
            props.history.push('/');
        }
    }

    public render() {
        const {classes, history, course} = this.props;
        return (
            <div className={classes['root']}>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            area-label='Menu'
                            color='inherit'
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant='title' color='inherit' className={classes.flex}>
                            {`GradeMe v4 - Course ${course && course.name}`}
                        </Typography>
                        <UserPanelContainer history={history}/>
                    </Toolbar>
                </AppBar>
                <ProjectsTableContainer/>
                <InstructorsTableContainer/>
                <StudentsTableContainer/>
                <ProjectDialogContainer/>
                <InstructorDialogContainer/>
                <StudentDialogContainer/>
            </div>
        );
    }
}

export default withStyles(styles)<ICourseScreenProps>(CourseScreen);
