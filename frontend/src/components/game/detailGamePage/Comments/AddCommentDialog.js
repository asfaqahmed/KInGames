import React, {useState} from 'react';
import s from "./Comments.module.css";
import profile from "../../../main/header/ProfileBlock/Profile/Profile.module.css";
import {BASE_URL} from "../../../../config";
import {connect} from "react-redux";
import {addComment} from "../../../../redux/reducers/commentReducer";


const AddCommentDialog = (props) => {
    const [commentText, setCommentText] = useState('')
    const inputTextRef = React.createRef()

    const onAddComment = () => {
        props.addComment(props.slug, commentText, null, null)
        setCommentText('')
        inputTextRef.current.textContent = ''
    }

    const getSendButton = () => {
        if(commentText.length !== 0)
            return <div className={s.sendButton} onClick={onAddComment}>COMMENT</div>
    }

    if(props.user)
        return (
            <>
                <div className={s.commentDialog}>
                    <div className={profile.avatar} style={{backgroundImage: `url(${BASE_URL + props.user.kin_user.avatar.slice(1)})`,
                        backgroundPosition: "center",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'}} />

                    <div className={s.textInput} contentEditable={true} data-placeholder={'Enter your comment'}
                         onInput={(e) => setCommentText(e.target.textContent)}
                         ref={inputTextRef}/>
                </div>

                {getSendButton()}
                <br/>
            </>
        );
    else
        return (
            <div style={{color: '#ffa3a3'}}>You need to authenticate in order to leave comments</div>
        )
};
let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        addComment: (gameSlug, body, top_level_comment, replied_comment) => dispatch(addComment(gameSlug, body, top_level_comment, replied_comment))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommentDialog);