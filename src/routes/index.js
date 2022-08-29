import React from 'react'
import {Switch, Route} from 'react-router'
import WebRoute from './web'
import ShopRoute from './shop'
import Appointment from "../components/pages/shopdetail/appointment";



export default function AllRoutes(props) {
    return (
        <Switch>

            {/*Without layout*/}
            <Route path={ `${process.env.PUBLIC_URL}/kapperszaak/:slug/afspraak` } component={Appointment}/>
            <Route path={ `${process.env.PUBLIC_URL}/shop`} component={ShopRoute}/>
            <Route path='/' component={WebRoute}/>

        </Switch>
    )
}
