import * as React from 'react';
import {PROJECTS_STORE} from '../../stores/constants';
import {inject} from 'mobx-react';
import {observer} from 'mobx-react';
import {MyTable} from '../MyTable/MyTable';
import {HomeStore} from '../../stores/HomeStore';
import {CourseScreenStore} from '../../stores/CourseScreenStore';

export interface IProjectsTableContainerProps {
    courseScreen?: CourseScreenStore;
}

export interface IProjectsTableContainerState {
}

@inject('courseScreen')
@observer
export class ProjectsTableContainer extends React.Component<IProjectsTableContainerProps, IProjectsTableContainerState> {
    constructor(props: IProjectsTableContainerProps) {
        super(props);
    }

    public render() {
        console.log('Rendering ProjectsTableContainer');
        return (
            <MyTable
                name='CourseScreen.projectsTable'
                model={this.props.courseScreen.projectsTable}
                onEdit={this.props.courseScreen.editSelectedProject}
                onAdd={this.props.courseScreen.addProject}
                onDelete={this.props.courseScreen.deleteSelectedProjects}
                onOpen={this.props.courseScreen.openSelectedProject}
            />
        );
    }
}