import React from "react";
import s from './ProfileBlock.module.css'
import {connect} from "react-redux";
import {showModalWindow} from "../../../../redux/reducers/modalWindowReducer";
import LoginForm from "../../../accounts/LoginForm";
import Profile from "./Profile/Profile";


let ProfileBlock = (props) => {
    let get_block_content = () => {
        if(!props.isAuthenticated)
            return <div className={s.greyButton} onClick={() => props.showModalWindow(<LoginForm />, 500, 540)}>Sing in</div>
        else
            return <Profile />
    }
    return (
        <div className={s.profileBlock}>
            {get_block_content()}
        </div>
    )
}


let mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        showModalWindow: (content, width, height) => dispatch(showModalWindow(content, width, height))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBlock)
