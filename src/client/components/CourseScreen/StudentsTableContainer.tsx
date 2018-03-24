import * as React from 'react';
import {inject} from 'mobx-react';
import {observer} from 'mobx-react';
import {MyTable} from '../MyTable/MyTable';
import {HomeStore} from '../../stores/HomeStore';
import {CourseScreenStore} from '../../stores/CourseScreenStore';

export interface IStudentsTableContainerProps {
    courseScreen?: CourseScreenStore;
}

export interface IStudentsTableContainerState {
}

@inject('courseScreen')
@observer
export class StudentsTableContainer extends React.Component<IStudentsTableContainerProps, IStudentsTableContainerState> {
    constructor(props: IStudentsTableContainerProps) {
        super(props);
    }

    public render() {
        console.log('Rendering StudentsTableContainer');
        return (
            <MyTable
                name='CourseScreen.studentsTable'
                model={this.props.courseScreen.studentsTable}
                onEdit={this.props.courseScreen.editSelectedStudent}
                onAdd={this.props.courseScreen.addStudent}
                onDelete={this.props.courseScreen.deleteSelectedStudents}
            />
        );
    }
}