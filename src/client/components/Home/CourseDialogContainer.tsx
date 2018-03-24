import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {HOME_STORE} from '../../stores/constants';
import {inject, observer} from 'mobx-react';
import {CourseDialog} from './CourseDialog';

export interface ICourseDialogContainerProps {
    // Stores will be injected by mobx
}

export interface ICourseDialogContainerState {
}

@inject(HOME_STORE)
@observer
export class CourseDialogContainer extends React.Component<ICourseDialogContainerProps, ICourseDialogContainerState> {
    constructor(props: ICourseDialogContainerProps, context: any) {
        super(props, context);
    }

    public render() {
        const courseDialog = this.props[HOME_STORE].courseDialog;
        return (
            <CourseDialog
                open={courseDialog.isOpen}
                onClose={courseDialog.cancel}
                onSave={courseDialog.save}
                name={courseDialog.name}
                onNameChange={courseDialog.setName}
                description={courseDialog.description}
                onDescriptionChange={courseDialog.setDescription}
            />
        );
    }
}