const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//좋아요 데이터 가져오기
router.post("/getLikes", (req, res) => {

    let variable = {};

    if(req.body.videoId){
        variable = { videoId: req.body.videoId}
    }else{
        variable = { commentId: req.body.commentId }
    }

    Like.find(variable)
        .exec((err, likes) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })

});

//싫어요 데이터 가져오기
router.post("/getDislikes", (req, res) => {

    let variable = {};

    if(req.body.videoId){
        variable = { videoId: req.body.videoId}
    }else{
        variable = { commentId: req.body.commentId }
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes })
        })

});


//좋아요 버튼 클릭시
router.post("/upLike", (req, res) => {

    let variable = {};

    if(req.body.videoId){
        variable = { videoId: req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId: req.body.commentId, userId : req.body.userId }
    }

    //클릭정보 넣기

    const like = new Like(variable);

    like.save((err, likeResult) => {
        if (err) return  res.json({ success: false, err })

        //만약 싫어요가 클릭되어있다면, 좋아요를 눌렀을때 싫어요 -1 한다
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if (err) return res.status(400).send(err)
                res.status(200).json({ success: true, disLikeResult })
            })
    })

});

//좋아요가 되어있는 버튼 클릭시(좋아요 취소)
router.post("/unLike", (req, res) => {

    let variable = {};

    if(req.body.videoId){
        variable = { videoId: req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId: req.body.commentId, userId : req.body.userId }
    }

    //클릭정보 넣기
    const like = new Like(variable);

    like.save((err, likeResult) => {
        if (err) return res.status(400).send(err)

        //만약 좋아요가 클릭되어있다면, 좋아요를 눌렀을때 좋아요 -1 한다
        Dislike.findOneAndDelete(variable)
            .exec((err, result) => {
                if (err) return res.status(400).send(err)
                res.status(200).json({ success: true, result })
            })
    })

});

//싫어요가 되어있는 버튼 클릭시(싫어요 취소)
router.post("/unDisLike", (req, res) => {

    let variable = {};

    if(req.body.videoId){
        variable = { videoId: req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId: req.body.commentId, userId : req.body.userId }
    }


    //만약 싫어요 클릭되어있다면, 싫어요 눌렀을때 싫어요 -1 한다
    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, result })
        })

});

//싫어요 버튼 클릭시
router.post("/upDisLike", (req, res) => {

    let variable = {};

    if(req.body.videoId){
        variable = { videoId: req.body.videoId, userId : req.body.userId}
    }else{
        variable = { commentId: req.body.commentId, userId : req.body.userId }
    }

    //클릭정보 넣기
    const dislike = new Dislike(variable);

    dislike.save((err, dislikeResult) => {
        if (err) return res.status(400).send(err)

        //만약 좋아요 클릭되어있다면, 싫어요 눌렀을때 좋아요 -1 한다
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if (err) return res.status(400).send(err)
                res.status(200).json({ success: true, likeResult })
            })
    })

});

module.exports = router;