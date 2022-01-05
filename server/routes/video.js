const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const { Subscriber } = require("../models/Subscriber");

const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

//config 옵션
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

//single : 파일한개씩 업로드
var upload = multer({ storage: storage }).single("file")

router.post("/uploadfiles", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});

//비디오 업로드
router.post("/uploadVideo", (req, res) => {
    
    const video = new Video(req.body);

    //디비에 저장
    video.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        res.status(200).json({ success: true })
    })
});

//데이터 리스트
router.get("/getVideos", (req, res) => {
    //데이터를 db에서 가져와 클라이언트에 보낸다
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, videos})
        })
});


//detailPage 데이터 
router.post("/getVideoDetail", (req, res) => {
//데이터를 db에서 가져와 클라이언트에 보낸다
    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, videoDetail })
    })
});

//썸네일 저장하고 비디오 정보 가져옴
router.post("/thumbnail", (req, res) => {
    let filePath ="";
    let fileDuration ="";

   //비디오 정보 가져옴
   ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        //console.log(req.body.url);
        //console.log(metadata);

        fileDuration = metadata.format.duration;

    });

    //썸네일 생성 **filenames = thumbnailname 
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            //console.log('Will generate ' + filenames.join(', '))
            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            //console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration})
        })
        .on('error', function (err) {
            //console.error(err);
            return res.json({ success: false, err });
        })
        .screenshots({
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            filename:'thumbnail-%b.png'
        });

});

//구독동영상
router.post("/getSubscriptionVideos", (req, res) => {

    //나를 구독하는 사람들은 찾음
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })

    //찾은사람들의 비디오를 가지고 옴
    //req.body._id 단건일때는 이렇게 가져옴

     Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })

});




module.exports = router;