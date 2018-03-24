import {observable, computed, action, autorun, runInAction} from 'mobx';
import {loadUsersAPI} from '../utils/api-facade';
import {signInAPI} from '../api/api';
import {ISignInRequestDTO} from '../../shared/ISignInRequestDTO';
import {ISignInReplyDTO} from '../../shared/ISignInReplyDTO';
import {RootStore} from './RootStore';

export interface ISignedInUser {
    id: string;
    username: string;
    token: string;
}

export class AuthStore {
    @observable
    public username: string;
    @observable
    public password: string;
    @observable
    public signedInUser: ISignedInUser;
    @observable
    public error: string;

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.username = '';
        this.password = '';
        this.signedInUser = undefined;
        this.loadData();
        this.initPersistData();
    }

    @action
    public async signIn() {
        const request: ISignInRequestDTO = {
            userName: this.username,
            password: this.password
        };
        const reply: ISignInReplyDTO = await signInAPI(request);
        runInAction(() => {
            if (reply.user) {
                this.signedInUser = {
                    id: '',
                    username: reply.user.userName,
                    token: ''
                };
                this.rootStore.router.push('/');
                // TODO navigate to Home
            } else {
                this.error = reply.error;
            }
        });
    }

    @action
    public signOut() {
        this.signedInUser = null;
    }

    @action
    public setUsername = (username: string) => {
        this.username = username;
    }

    @action
    public setPassword = (password: string) => {
        this.password = password;
    }

    @action
    private loadData = () => {
        const data = localStorage.getItem('AuthStore');
        if (data) {
            const {id, username, token} = JSON.parse(data);
            this.signedInUser = {id, username, token};
        }
    }

    private initPersistData = () => {
        autorun(() => {
            if (this.signedInUser) {
                const {id, username, token} = this.signedInUser;
                const data = JSON.stringify({id, username, token});
                localStorage.setItem('AuthStore', data);
            }
        });
    }
}