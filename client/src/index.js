import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home';


import RequestDoctor from './components/RequestDoctor';
import VerifyDoctor from './components/VerifyDoctor';
import AddAlternative from './components/AddAlternative';
import GetAlternatives from './components/GetAlternatives';

// import * as serviceWorker from './serviceWorker';

import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/RequestDoctor' component={RequestDoctor} />
            <Route path='/VerifyDoctor' component={VerifyDoctor} />
            <Route path='/AddAlternative' component={AddAlternative} />
            <Route path='/GetAlternatives' component={GetAlternatives} />
        </Switch>
    </Router>,
    document.getElementById('root')
);

// serviceWorker.unregister();
