import * as React from 'react';
import {inject} from 'mobx-react';
import {observer} from 'mobx-react';
import {MyTable} from '../MyTable/MyTable';
import {HomeStore} from '../../stores/HomeStore';
import {CourseScreenStore} from '../../stores/CourseScreenStore';

export interface IInstructorsTableContainerProps {
    courseScreen?: CourseScreenStore;
}

export interface IInstructorsTableContainerState {
}

@inject('courseScreen')
@observer
export class InstructorsTableContainer extends React.Component<IInstructorsTableContainerProps, IInstructorsTableContainerState> {
    constructor(props: IInstructorsTableContainerProps) {
        super(props);
    }

    public render() {
        console.log('Rendering InstructorsTableContainer');
        return (
            <MyTable
                name='CourseScreen.instructorsTable'
                model={this.props.courseScreen.instructorsTable}
                onEdit={this.props.courseScreen.editSelectedInstructor}
                onAdd={this.props.courseScreen.addInstructor}
                onDelete={this.props.courseScreen.deleteSelectedInstructors}
            />
        );
    }
}