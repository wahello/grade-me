import * as React from 'react';
import Card from 'material-ui/Card';
import {CardActions, CardContent, TextField, WithStyles} from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button';

const styles = theme => ({
    card: {
        maxWidth: 400
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    },
    button: {
        margin: theme.spacing.unit
    }
});

export interface IAuthCardProps {
    username: string;
    password: string;
    onUsernameChange: (username: string) => void;
    onPasswordChange: (password: string) => void;
    onSignIn: () => void;
}

type AuthCardPropsWithStyle = IAuthCardProps & WithStyles<'card' | 'textField' | 'button'>;

class AuthCard extends React.PureComponent<AuthCardPropsWithStyle> {
    constructor(props: AuthCardPropsWithStyle) {
        super(props);
    }

    public render() {
        const {classes, username, onUsernameChange, password, onPasswordChange, onSignIn} = this.props;
        return (
            <Card className={classes.card}>
                <CardContent>
                    <TextField
                        id='username'
                        label='Username'
                        className={classes.textField}
                        value={username}
                        onChange={this.onUsernameChange}
                        margin='normal'
                    />
                    <TextField
                        id='password'
                        label='Password'
                        className={classes.textField}
                        value={password}
                        onChange={this.onPasswordChange}
                        margin='normal'
                    />
                </CardContent>
                <CardActions>
                    <Button
                        variant='raised'
                        color='primary'
                        className={classes.button}
                        onClick={onSignIn}
                    >
                        Sign In
                    </Button>
                </CardActions>
            </Card>
        );
    }

    private onUsernameChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.props.onUsernameChange(e.target.value);
    }

    private onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.props.onPasswordChange(e.target.value);
    }
}

export default withStyles(styles)<IAuthCardProps>(AuthCard);