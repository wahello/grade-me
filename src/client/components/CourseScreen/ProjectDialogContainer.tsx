import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {ProjectDialog} from './ProjectDialog';
import {CourseScreenStore} from '../../stores/CourseScreenStore';

export interface IProjectDialogContainerProps {
    courseScreen?: CourseScreenStore;
}

export interface IProjectDialogContainerState {
}

@inject('courseScreen')
@observer
export class ProjectDialogContainer extends React.Component<IProjectDialogContainerProps, IProjectDialogContainerState> {
    constructor(props: IProjectDialogContainerProps, context: any) {
        super(props, context);
    }

    public render() {
        const projectDialog = this.props.courseScreen.projectDialog;
        return (
            <ProjectDialog
                open={projectDialog.isOpen}
                onClose={projectDialog.cancel}
                onSave={projectDialog.save}
                name={projectDialog.name}
                onNameChange={projectDialog.setName}
                description={projectDialog.description}
                onDescriptionChange={projectDialog.setDescription}
            />
        );
    }
}