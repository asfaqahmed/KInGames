import React, {useEffect, useState} from 'react';
import profile from '../../../../main/header/ProfileBlock/Profile/Profile.module.css'
import s from './Comment.module.css'
import {ADMIN, BASE_URL, MANAGER} from "../../../../../config";
import {AiFillEdit, AiTwotoneDelete} from 'react-icons/all'
import {connect} from "react-redux";
import {
    fetchTopLevelCommentReplies,
    manageDeletedComments, manageShowManageButtons, manageUpdateObject
} from "../../../../../redux/reducers/commentReducer";
import moment from 'moment'
import AddCommentDialog from "../AddCommentDialog";
import TopLevelComment from "./TopLevelComment";


const Comment = (props) => {
    useEffect(() => {
        if(props.comment)
            props.showManageButtonsForId === props.comment.id ? setManageButtonShow(s.visible) : setManageButtonShow(s.hidden)

    }, [props.showManageButtonsForId])

    const [manageButtonShow, setManageButtonShow] = useState(s.hidden)
    const [showReplyInput, setShowReplyInput] = useState(false)

    const getDeleteButton = () => {
        return (
            <div style={{width: '100%', height: '100%'}} onClick={() => {
                if(window.confirm('Are you sure you want to delete comment?')){
                    props.manageDeleted([...props.deleted, props.comment.id])
                }
            }}><AiTwotoneDelete /> DELETE</div>
        )
    }
    const getEditButton = () => {
        return <div onClick={() => {props.manageUpdateObject({onUpdate: true, updatedId: props.comment.id})}}><AiFillEdit /> EDIT</div>
    }
    const showCommentManager = () => {
        let showAvailableActions = () => {
            if(props.user.username === props.comment.user.username)
                return (
                    <>
                        {getEditButton()}
                        <hr/>
                        {getDeleteButton()}
                    </>
                )
            else if(props.user.kin_user.role === ADMIN || props.user.kin_user.role === MANAGER)
                return getDeleteButton()

        }

        if(props.showManageButtons && props.showManageButtonsForId === props.comment.id)
            return (
                <div className={s.manageButtons}>
                    {showAvailableActions()}
                </div>
            )
    }
    const showManageShowButton = () => {
        if(props.user)
            return (
                <div className={`${s.manageButtonsBlock} ${manageButtonShow}`} onClick={() => {
                    let show = props.showManageButtonsForId === props.comment.id ? !props.showManageButtons : true
                    props.manageShowManageButtons({id: props.comment.id, show: show})
                }}>
                    ...
                    {showCommentManager()}
                </div>
            )
    }
    const getInnerPart = () => {
        if(!props.isInner)
            return (
                <div>
                    <TopLevelComment {...props} />
                </div>
            )
    }
    const getReplyInput = () => {
        let topLevelComment = props.comment.top_level_comment === null ? props.comment.id : props.comment.top_level_comment
        let repliedComment = props.comment.top_level_comment === null ? null : props.comment.id
        if(showReplyInput)
            return <AddCommentDialog slug={props.slug} top_level_comment={topLevelComment} replied_comment={repliedComment} />
    }
    const getRepliedRef = () => {
        if(props.comment.replied_comment){
            const curUrl = window.location.href.substring(0, window.location.href.indexOf('#'))
            return (
                <a href={`${curUrl}#Comment${props.comment.replied_comment}`}>
                    <div className={s.repliedBox}>
                        {props.comment.replied_text}
                    </div>
                </a>
            )
        }
    }

    const getBodyPart = () => {
        if(!props.updateObject.onUpdate || props.comment.id !== props.updateObject.updatedId)
            return (
                <>
                <div className={`${s.comment} ${props.isInner ? s.inner : ''}`} onMouseEnter={() => {
                    setManageButtonShow(s.visible)
                }} onMouseLeave={() => {
                    if(props.showManageButtons && props.showManageButtonsForId === props.comment.id)
                        setManageButtonShow(s.visible)
                    else
                        setManageButtonShow(s.hidden)
                }} id={`Comment${props.comment.id}`}>
                    <div className={profile.avatar} style={{backgroundImage: `url(${BASE_URL + props.comment.user.kin_user.avatar.slice(1)})`,
                            backgroundPosition: "center",
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover'}}> </div>

                    <div>
                        <div style={{fontSize: 'smaller', fontWeight: '600', marginBottom: '10px'}}>{props.comment.user.first_name} {props.comment.user.last_name}
                            <div style={{marginLeft: '12px', display: 'inline', fontWeight: '400'}}>{moment(props.comment.created_at).fromNow()}</div>
                        </div>

                        {getRepliedRef()}

                        {props.comment.body}
                    </div>

                    <div>
                        {showManageShowButton()}
                    </div>
                </div>

                    <div style={{marginLeft: '6.2%', marginTop: '10px', color: '#848484', cursor: 'pointer', fontSize: '14px'}}
                         onClick={() => {setShowReplyInput(!showReplyInput)}}>REPLY</div>
                </>
            )
        else
            return <AddCommentDialog initText={props.comment.body} id={props.comment.id} onUpdate={true} />
    }

    if(props.comment)
        return (
            <>
                {getBodyPart()}

                <div style={{marginLeft: '70px', marginTop: '20px'}}>
                    {getReplyInput()}
                </div>

                <div style={{marginLeft: '70px'}}>
                    {getInnerPart()}
                </div>
            </>
        );
    else
        return (
            <div>LOADING</div>
        )
};


let mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        deleted: state.comment.deletedComments,
        showManageButtonsForId: state.comment.showManageButtonsForId,
        showManageButtons: state.comment.showManageButtons,
        updateObject: state.comment.updateObject
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchReplies: (commentId) => dispatch(fetchTopLevelCommentReplies(commentId)),
        manageDeleted: (deletedComments) => dispatch(manageDeletedComments(deletedComments)),
        manageShowManageButtons: (showManageButtonsForId) => dispatch(manageShowManageButtons(showManageButtonsForId)),
        manageUpdateObject: (newUpdateObj) => dispatch(manageUpdateObject(newUpdateObj))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Comment);