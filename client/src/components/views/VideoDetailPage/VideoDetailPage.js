import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import SideVideo from './Section/SideVideo';
import Subscriber from './Section/Subscribe';
import Comments from './Section/Comment'
import LikeDislikes from './Section/LikeDislikes';
function VideoDetailPage(props) {


    const videoId = props.match.params.videoId
    const [videoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const videoVariable = {
        videoId: videoId
    }

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videoDetail)
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('데이터를 가져오지못했습니다.')
                }
            })

        axios.post('/api/comment/getComments', videoVariable)
            .then(response => {
                if (response.data.success) {
                    //console.log('response.data.comments',response.data)
                    setCommentLists(response.data.comments)
                } else {
                    alert('댓글을 불러오지 못했습니다.')
                }
            })


    }, [])

    const updateComment = (newComment) => {
        console.log(CommentLists)
        setCommentLists(CommentLists.concat(newComment))
    }


    if (videoDetail.writer) {
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${videoDetail.filePath}`} poster={`http://localhost:5000/${videoDetail.thumbnail}`} controls></video>

                        <List.Item
                            actions={[ <LikeDislikes videoId={videoId} userId={localStorage.getItem('userId')}/>, <Subscriber userTo={videoDetail.writer._id} userFrom={localStorage.getItem('userId')} />]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={videoDetail.writer && videoDetail.writer.image} />}
                                title={<a href="https://ant.design">{videoDetail.title}</a>}
                                description={videoDetail.description}
                            />
                            <div></div>
                        </List.Item>

                        <Comments CommentLists={CommentLists} postId={videoDetail._id} refreshFunction={updateComment} />

                    </div>
                </Col>
                <Col lg={6} xs={24}>

                    <SideVideo />

                </Col>
            </Row>
        )

    } else {
        return (
            <div>Loading...</div>
        )
    }


}

export default VideoDetailPage
