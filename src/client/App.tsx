import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import {useStrict} from 'mobx';
import {Provider} from 'mobx-react';

import {NavBar} from './components/NavBar/NavBar';
import {HomeContainer} from './components/Home/HomeContainer';
import Auth from './components/Auth/Auth';
import {RootStore} from './stores/RootStore';
import createBrowserHistory from 'history/createBrowserHistory';
import {Router} from 'react-router';
import {syncHistoryWithStore} from 'mobx-react-router';
import {CourseScreenContainer} from './components/CourseScreen/CourseScreenContainer';

useStrict(true);

const browserHistory = createBrowserHistory();
const rootStore = new RootStore();
const history = syncHistoryWithStore(browserHistory, rootStore.router);

const theme = createMuiTheme();

export const App = () => (
    <Provider {...rootStore}>
        <MuiThemeProvider theme={theme}>
            <Router history={history}>
                <Switch>
                    {/*<NavBar/>*/}
                    <Route exact path='/' component={HomeContainer}/>
                    <Route path='/auth' component={Auth}/>
                    <Route path='/course' component={CourseScreenContainer}/>
                </Switch>
            </Router>
        </MuiThemeProvider>
    </Provider>
);
