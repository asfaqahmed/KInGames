import React from "react";
import {connect} from "react-redux";
import {Route, Redirect} from 'react-router-dom';
import {ADMIN, MANAGER} from "../../../config";


const PrivateRouteAdminOrManagerOnly = ({component: Component, auth,  ...rest}) => {
    return (
        <Route {...rest} render={
            props => {
                if(auth.isLoading) {
                    return <div>LOADING</div>
                } else if(!localStorage.getItem('token')){
                    // showMessage([{message: 'You have no permissions to get to this page', type: 'danger'}])
                    return <Redirect to={'/'} />
                } else {
                    return auth.user && <PrivateRouteChild component={Component} auth={auth} {...rest} />
                }
            }
        } />
    );
};

const PrivateRouteChild = ({component: Component, auth,  ...rest}) => {
    return (
        <Route {...rest} render={
            props => {
                if(auth.user.kin_user.role === ADMIN || auth.user.kin_user.role === MANAGER) {
                    return <Component {...rest} />
                } else {
                    // showMessage([{message: 'You have no permissions to get to this page', type: 'danger'}])
                    return <Redirect to={'/'} />
                }
            }
        } />
    )
}


let mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(PrivateRouteAdminOrManagerOnly);