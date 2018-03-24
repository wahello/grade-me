import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {AUTH_STORE} from '../../stores/constants';
import {inject, observer} from 'mobx-react';
import AuthCard from './AuthCard';

export interface IAuthCardContainerProps {
    // Stores will be injected by mobx
}

export interface IAuthCardContainerState {
    todo?: any;
}

@inject(AUTH_STORE)
@observer
export class AuthCardContainer extends React.Component<IAuthCardContainerProps, IAuthCardContainerState> {
    constructor(props: IAuthCardContainerProps, context: any) {
        super(props, context);
        this.state = {
            // TODO
        };
    }

    public render() {
        const {username, password} = this.props[AUTH_STORE];
        return (
            <AuthCard
                username={username}
                password={password}
                onUsernameChange={this.onUsernameChange}
                onPasswordChange={this.onPasswordChange}
                onSignIn={this.onSignIn}
            />
        );
    }

    private onUsernameChange = (username: string) => {
        this.props[AUTH_STORE].setUsername(username);
    }

    private onPasswordChange = (password: string) => {
        this.props[AUTH_STORE].setPassword(password);
    }

    private onSignIn = () => {
        this.props[AUTH_STORE].signIn();
    }
}