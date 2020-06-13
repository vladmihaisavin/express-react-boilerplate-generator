import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { createBrowserHistory } from "history"
import { Router, Route, Switch, Redirect } from "react-router-dom"
import NotFound from './components/pages/NotFound.jsx'
import Main from './components/pages/Main.jsx'

import Dashboard from './components/sections/Dashboard.jsx'

const hist = createBrowserHistory()

const withLayout = (Content) => (props) => <Main content={Content} { ...props } />

ReactDOM.render(
    <Router history={hist}>
        <Switch>
            <Route exact path="/">
                <Redirect to="/dashboard" />
            </Route>
			<Route exact path="/dashboard" component={withLayout(Dashboard)} />

            <Route component={NotFound} />
        </Switch>
    </Router>,
    document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
