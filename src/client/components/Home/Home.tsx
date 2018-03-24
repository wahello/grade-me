import * as React from 'react';
import {AppBar, IconButton} from 'material-ui';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import {Theme, withStyles, WithStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/es/Button';
import {UserPanelContainer} from './UserPanelContainer';
import {History} from 'history';
import {CoursesTableContainer} from './CoursesTableContainer';
import {CourseDialogContainer} from './CourseDialogContainer';

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

export interface IHomeProps {
    history: History;
    onFetch: () => void;
}

type HomePropsWithStyles = IHomeProps & WithStyles<'root' | 'flex' | 'menuButton'>;

class Home extends React.Component<HomePropsWithStyles, {}> {
    constructor(props: HomePropsWithStyles) {
        super(props);
    }

    public componentDidMount() {
        this.props.onFetch();
    }

    public render() {
        const {classes, history} = this.props;
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
                            GradeMe v4
                        </Typography>
                        <UserPanelContainer history={history}/>
                    </Toolbar>
                </AppBar>
                <CoursesTableContainer/>
                <CourseDialogContainer/>
            </div>
        );
    }
}

export default withStyles(styles)<IHomeProps>(Home);

/*
<Jumbotron>
    <img src={logoImg} className={css.logo}/>
    <h1>FullStack React with TypeScript</h1>
    <p>This is a starter kit to get you up and running with React with TypeScript.</p>
</Jumbotron>
*/