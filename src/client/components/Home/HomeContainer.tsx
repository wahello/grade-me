import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {HOME_STORE} from '../../stores/constants';
import {inject, observer} from 'mobx-react';
import Home from './Home';

export interface IHomeContainerProps extends RouteComponentProps<any> {
    // Stores will be injected by mobx
}

export interface IHomeContainerState {
    todo?: any;
}

@inject(HOME_STORE)
@observer
export class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {
    constructor(props: IHomeContainerProps, context: any) {
        super(props, context);
        this.state = {
            // TODO
        };
    }

    public render() {
        const {history} = this.props;
        const home = this.props[HOME_STORE];
        return (
            <Home history={history} onFetch={home.fetch}/>
        );
    }
}
