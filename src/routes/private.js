import React from "react";
import { Route, Redirect } from "react-router-dom";
import {connect, useSelector} from "react-redux";

const PrivateRoute = (props) => {
    // const {user, isAuthenticated, token} =
    //     useSelector((state) => state?.AuthReducer);
    //const token  = localStorage.getItem('token')
    //console.log("token", props.isAuthenticated)
    return (
        <Route render={() => (
            props.isAuthenticated
                ? <props.component {...props} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )}/>
    );
};


const mapStateToProps = ({ AuthReducer }) => ({
    isAuthenticated: AuthReducer.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);
