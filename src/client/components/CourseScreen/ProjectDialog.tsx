import * as React from 'react';
import {
    Button, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, WithStyles
} from 'material-ui';
import {observer} from 'mobx-react';

export interface IProjectDialogProps {
    open: boolean;
    text?: string;
    onClose: () => void;
    onSave: () => void;
    name: string;
    description: string;
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
}

export interface IProjectDialogState {
}

@observer
export class ProjectDialog extends React.Component<IProjectDialogProps, IProjectDialogState> {
    constructor(props: IProjectDialogProps) {
        super(props);
    }

    public render() {
        const {open, onClose, text, name, description} = this.props;
        return (
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby='form-dialog-title'
            >
                <DialogTitle id='project-dialog-title'>Project</DialogTitle>
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
                        value={description}
                        onChange={this.onDescriptionChange}
                        margin='dense'
                        id='description'
                        label='Description'
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

    private onDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        this.props.onDescriptionChange(e.target.value);
    }
}