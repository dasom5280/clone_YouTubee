const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

router.post("/saveComment", (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err })

        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({ success: false, err })
                return res.status(200).json({ success: true, result })
            })
    })

})

router.post("/getComments", (req, res) => {
    Comment.find() //postId의 데이터로 writer를 못찾아서 모두 가져오게끔 함
        .populate('writer')
        .exec((err, comments) => {
            //console.log(comments);
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, comments })
        })

});




module.exports = router;