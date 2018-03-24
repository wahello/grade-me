import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {StudentDialog} from './StudentDialog';
import {CourseScreenStore} from '../../stores/CourseScreenStore';

export interface IStudentDialogContainerProps {
    courseScreen?: CourseScreenStore;
}

export interface IStudentDialogContainerState {
}

@inject('courseScreen')
@observer
export class StudentDialogContainer extends React.Component<IStudentDialogContainerProps, IStudentDialogContainerState> {
    constructor(props: IStudentDialogContainerProps, context: any) {
        super(props, context);
    }

    public render() {
        const studentDialog = this.props.courseScreen.studentDialog;
        return (
            <StudentDialog
                open={studentDialog.isOpen}
                name={studentDialog.name}
                onNameChange={studentDialog.setName}
                login={studentDialog.login}
                onLoginChange={studentDialog.setLogin}
                email={studentDialog.email}
                onEmailChange={studentDialog.setEmail}
                password={studentDialog.password}
                onPasswordChange={studentDialog.setPassword}
                onClose={studentDialog.cancel}
                onSave={studentDialog.save}
            />
        );
    }
}