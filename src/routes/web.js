import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import WebLayout from '../WebLayout'

import Home from "../components/pages/Home";
import Info from "../components/pages/Info";

export default function WebRoute()
{
    const { path } = useRouteMatch();
    return (
        <>
            <Switch>
                <WebLayout>
                    <Route exact path='/' component={Home} />
                    <Route path="/informatie" component={Info}/>
                </WebLayout>
            </Switch>
        </>
    )
}