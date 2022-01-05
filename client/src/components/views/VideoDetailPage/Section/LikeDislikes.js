import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);

    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);

    let variable = {};

    if (props.video) {
        //비디오에 대한 데이터
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
        //댓글에 대한 데이터
        variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        //Like
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                //console.log('getLikes',response.data)
                if (response.data.success) {
                    //좋아요 수
                    setLikes(response.data.likes.length)
                    
                    //좋아요를 눌렀는지 
                    response.data.likes.map(like => {
                        //내가 좋아요를 누른 목록에 내 아이디가 있다면
                        if (like.userId === props.userId) {
                            //좋아요를 눌렀다는 정보를 가져옴
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert('like 정보를 가져오지 못했습니다.')
                }
            })

        //Dislike
        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                //console.log('getDislike',response.data)
                if (response.data.success) {
                    //싫어요 수
                    setDislikes(response.data.dislikes.length)

                   //싫어요를 눌렀는지 
                    response.data.dislikes.map(dislike => {
                         //내가 싫어요를 누른 목록에 내 아이디가 있다면
                        if (dislike.userId === props.userId) {
                            //싫어요를 눌렀다는 정보를 가져옴
                            setDislikeAction('disliked')
                        }
                    })
                } else {
                    alert('dislike 정보를 가져오지 못했습니다.')
                }
            })

    }, [])

    //좋아요 버튼 이벤트
    const onLike = () => {

        if (LikeAction === null) {
            //좋아요 +1
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        //싫어요 버튼이 이미 되어있을때
                        if (DislikeAction !== null) {
                            //싫어요 -1 해준다
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }
                    } else {
                        alert('좋아요를 처리하는데 문제가 있습니다.')
                    }
                })
        } else {
            //좋아요 -1
            //좋아요버튼이 이미 되어있을때(좋아요 취소시)
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {

                        //좋아요 버튼이 이미 되어있을때, 좋아요 -1 한다
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    } else {
                        alert('좋아요를 처리하는데 문제가 있습니다.')
                    }
                })

        }

    }

    //싫어요 버튼 이벤트
    const onDisLike = () => {

        if (DislikeAction !== null) {
            //싫어요 -1
            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        //싫어요 버튼이 이미 되어있을때, 싫어요 취소
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)

                    } else {
                        alert('싫어요를 처리하는데 문제가 있습니다.')
                    }
                })

        } else {
            //싫어요 +1
            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked')

                        // 좋아요 버튼이 눌러있을때, 좋아요 -1
                        if(LikeAction !== null ) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }

                    } else {
                        alert('싫어요를 처리하는데 문제가 있습니다.')
                    }
                })


        }


    }

    return (
        <React.Fragment>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </React.Fragment>
    )
}

export default LikeDislikes