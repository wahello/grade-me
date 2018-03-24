import * as React from 'react';
import {COURSE_SCREEN_STORE} from '../../stores/constants';
import {inject, observer} from 'mobx-react';
import {CourseScreenStore} from '../../stores/CourseScreenStore';
import CourseScreen from './CourseScreen';
import {RouteComponentProps} from 'react-router';

export interface ICourseScreenContainerProps extends RouteComponentProps<any> {
    courseScreen?: CourseScreenStore;
}

export interface ICourseScreenContainerState {
}

@inject(COURSE_SCREEN_STORE)
@observer
export class CourseScreenContainer extends React.Component<ICourseScreenContainerProps, ICourseScreenContainerState> {
    constructor(props: ICourseScreenContainerProps, context: any) {
        super(props, context);
    }

    public render() {
        const {history} = this.props;
        const courseScreen = this.props.courseScreen;
        return (
            <CourseScreen
                courseId={courseScreen.courseId}
                course={courseScreen.course}
                history={history}
                onFetch={courseScreen.fetch}
            />
        );
    }
}