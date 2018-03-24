import * as React from 'react';
import {
    Button, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, WithStyles
} from 'material-ui';
import {observer} from 'mobx-react';

export interface IStudentDialogProps {
    open: boolean;
    text?: string;
    name: string;
    login: string;
    password: string;
    email: string;

    onClose: () => void;
    onSave: () => void;

    onNameChange: (name: string) => void;
    onLoginChange: (login: string) => void;
    onPasswordChange: (password: string) => void;
    onEmailChange: (email: string) => void;
}

export interface IStudentDialogState {
}

@observer
export class StudentDialog extends React.Component<IStudentDialogProps, IStudentDialogState> {
    constructor(props: IStudentDialogProps) {
        super(props);
    }

    public render() {
        const {open, onClose, text, name, login, password, email} = this.props;
        return (
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby='form-dialog-title'
            >
                <DialogTitle id='student-dialog-title'>Student</DialogTitle>
                <DialogContent>
                    {text && <DialogContentText>
                        {text}
                    </DialogContentText>}
                    <TextField
                        value={name}
                        onChange={this.onNameChange}
                        autoFocus={true}
                        margin='dense'
                        id='name'
                        label='Name'
                        type='text'
                        fullWidth={true}
                    />
                    <TextField
                        value={login}
                        onChange={this.onLoginChange}
                        margin='dense'
                        id='login'
                        label='Login'
                        type='text'
                        fullWidth={true}
                    />
                    <TextField
                        value={password}
                        onChange={this.onPasswordChange}
                        margin='dense'
                        id='password'
                        label='Password'
                        type='text'
                        fullWidth={true}
                    />
                    <TextField
                        value={email}
                        onChange={this.onEmailChange}
                        margin='dense'
                        id='email'
                        label='Email'
                        type='text'
                        fullWidth={true}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancel} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={this.onSave} color='primary'>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    private onCancel = () => {
        this.props.onClose();
    }

    private onSave = () => {
        this.props.onSave();
    }

    private onNameChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.props.onNameChange(e.target.value);
    }

    private onLoginChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.props.onLoginChange(e.target.value);
    }

    private onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.props.onPasswordChange(e.target.value);
    }

    private onEmailChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.props.onEmailChange(e.target.value);
    }
}