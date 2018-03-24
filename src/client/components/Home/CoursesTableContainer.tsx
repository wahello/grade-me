import * as React from 'react';
import {COURSES_STORE, HOME_STORE} from '../../stores/constants';
import {inject} from 'mobx-react';
import {observer} from 'mobx-react';
import {MyTable} from '../MyTable/MyTable';
import {HomeStore} from '../../stores/HomeStore';

export interface ICoursesTableContainerProps {
    home?: HomeStore;
}

export interface ICoursesTableContainerState {

}

@inject('home')
@observer
export class CoursesTableContainer extends React.Component<ICoursesTableContainerProps, ICoursesTableContainerState> {
    constructor(props: ICoursesTableContainerProps) {
        super(props);
    }

    public render() {
        console.log('Rendering CoursesTableContainer');
        return (
            <MyTable
                name='Home.coursesTable'
                model={this.props.home.coursesTable}
                onEdit={this.props.home.editSelectedCourse}
                onAdd={this.props.home.addCourse}
                onDelete={this.props.home.deleteSelectedCourses}
                onOpen={this.props.home.openSelectedCourse}
            />
        );
    }
}