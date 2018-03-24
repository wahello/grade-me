import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {InstructorDialog} from './InstructorDialog';
import {CourseScreenStore} from '../../stores/CourseScreenStore';

export interface IInstructorDialogContainerProps {
    courseScreen?: CourseScreenStore;
}

export interface IInstructorDialogContainerState {
}

@inject('courseScreen')
@observer
export class InstructorDialogContainer extends React.Component<IInstructorDialogContainerProps, IInstructorDialogContainerState> {
    constructor(props: IInstructorDialogContainerProps, context: any) {
        super(props, context);
    }

    public render() {
        const instructorDialog = this.props.courseScreen.instructorDialog;
        return (
            <InstructorDialog
                open={instructorDialog.isOpen}
                name={instructorDialog.name}
                onNameChange={instructorDialog.setName}
                login={instructorDialog.login}
                onLoginChange={instructorDialog.setLogin}
                email={instructorDialog.email}
                onEmailChange={instructorDialog.setEmail}
                password={instructorDialog.password}
                onPasswordChange={instructorDialog.setPassword}
                onClose={instructorDialog.cancel}
                onSave={instructorDialog.save}
            />
        );
    }
}