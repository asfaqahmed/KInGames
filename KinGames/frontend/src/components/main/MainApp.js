import React from "react";
import s from './MainApp.module.css'
import Header from "./header/Header";
import ModalWindow from "../crumbs/ModalWindow/ModalWindow";
import ReactNotifications from 'react-notifications-component';
import MainPageBody from "./body/MainPageBody";
import Footer from "./footer/Footer";
import {Route, withRouter} from 'react-router-dom'
import GameDetailsPage from "../game/detailGamePage/GameDetailsPage";
import PrivateRouteAdminOrManagerOnly from "../crumbs/PrivateRoute/PrivateRoute";
import CreateUpdateGamePage from "../game/createGamePage/CreateUpdateGamePage";
import CartDetailsPage from "../game/cartDetailsPage/CartDetailsPage";


let MainApp = (props) => {
    return (
        <>
            <ReactNotifications />
            <ModalWindow />
            <Header />

            <div className={s.mainBody}>
                <Route exact path={'/'} render={() => <MainPageBody />} />
                <Route path={'/games/'} render={() => <GameDetailsPage />} />
                <Route path={'/cart'} render={() => <CartDetailsPage />}/>
                <PrivateRouteAdminOrManagerOnly path={'/add-game'} component={CreateUpdateGamePage} isUpdate={false} />
                <PrivateRouteAdminOrManagerOnly path={'/update'} component={CreateUpdateGamePage} isUpdate={true} />
            </div>

            <Footer />
        </>
    )
}

export default withRouter(MainApp);
