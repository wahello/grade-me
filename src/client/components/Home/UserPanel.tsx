import * as React from 'react';
import {AppBar, IconButton, MenuItem} from 'material-ui';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import {Theme, withStyles, WithStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/es/Button';
import Menu from 'material-ui/Menu';
import {observer} from 'mobx-react';
import {ISignedInUser} from '../../stores/AuthStore';

const logoImg = require('../../../../assets/images/logo.png');

const styles = (theme: Theme) => ({
    root: {}
});

export interface IUserPanelProps {
    signedInUser?: ISignedInUser;
    onSignIn: () => void;
    onSignOut: () => void;
}

type UserPanelPropsWithStyles = IUserPanelProps & WithStyles<'root'>;

interface IState {
    anchorEl: HTMLElement;
}

class UserPanel extends React.Component<UserPanelPropsWithStyles, IState> {
    constructor(props: UserPanelPropsWithStyles) {
        super(props);
        this.state = {
            anchorEl: undefined
        };
    }

    public render() {
        const {classes, signedInUser} = this.props;
        const {anchorEl} = this.state;
        const buttonText = signedInUser ? 'Sign Out' : 'Sign in';
        return (
            <div className={classes['root']}>
                <Button
                    color='inherit'
                    aria-owns={anchorEl ? 'simple-menu' : null}
                    onClick={this.onButtonClick}
                >
                    {buttonText}
                </Button>
                {/*<Menu*/}
                    {/*id='signInMenu'*/}
                    {/*anchorEl={anchorEl}*/}
                    {/*open={!!anchorEl}*/}
                    {/*onClose={this.onMenuClose}*/}
                {/*>*/}
                    {/*<MenuItem onClick={this.onSignOut}>Sign Out</MenuItem>*/}
                {/*</Menu>*/}
            </div>
        );
    }

    private onButtonClick: React.MouseEventHandler<HTMLElement> = event => {
        const {signedInUser} = this.props;
        if (signedInUser) {
            this.setState({anchorEl: event.currentTarget});
            this.props.onSignOut();
        } else {
            this.props.onSignIn();
        }
    }

    private onSignOut: React.MouseEventHandler<HTMLElement> = event => {
        this.props.onSignOut();
    }

    private onMenuClose = () => {
        this.setState({anchorEl: null});
    }
}

export default withStyles(styles)<IUserPanelProps>(UserPanel);
