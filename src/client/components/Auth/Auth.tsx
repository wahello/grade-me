import * as React from 'react';
import {AppBar, IconButton} from 'material-ui';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import {Theme, withStyles, WithStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/es/Button';
import {History} from 'history';
import {AuthCardContainer} from './AuthCardContainer';
import {RouteComponentProps} from 'react-router-dom';

const styles = (theme: Theme) => ({
    root: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    } as React.CSSProperties
});

export interface IAuthProps extends RouteComponentProps<any>{
}

type AuthPropsWithStyles = IAuthProps & WithStyles<'root'>;

const Auth: React.SFC<AuthPropsWithStyles> = ({classes}) => {
    return (
        <div className={classes['root']}>
            <AuthCardContainer/>
        </div>
    );
};

export default withStyles(styles)<IAuthProps>(Auth);

/*
<Jumbotron>
    <img src={logoImg} className={css.logo}/>
    <h1>FullStack React with TypeScript</h1>
    <p>This is a starter kit to get you up and running with React with TypeScript.</p>
</Jumbotron>
*/