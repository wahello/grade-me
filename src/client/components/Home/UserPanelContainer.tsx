import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {AUTH_STORE} from '../../stores/constants';
import {inject, observer} from 'mobx-react';
import UserPanel from './UserPanel';
import {History} from 'history';

export interface IUserPanelContainerProps {
    history: History;
}

export interface IUserPanelContainerState {
}

@inject(AUTH_STORE)
@observer
export class UserPanelContainer extends React.Component<IUserPanelContainerProps, IUserPanelContainerState> {
    constructor(props: IUserPanelContainerProps, context: any) {
        super(props, context);
        this.state = {
            // TODO
        };
    }

    public render() {
        const {signedInUser} = this.props[AUTH_STORE];
        console.log('UserPanelContainer.render signedInUser=' + signedInUser);
        return (
            <UserPanel
                signedInUser={signedInUser}
                onSignIn={this.onSignIn}
                onSignOut={this.onSignOut}
            />
        );
    }

    private onSignIn = () => {
        this.props.history.push('/auth');
    }

    private onSignOut = () => {
        this.props[AUTH_STORE].signOut();
    }
}