import React, { useState } from 'react';
import { Typography, Form, Input, Icon, Button, message } from 'antd';
import Dropzone from 'react-dropzone';
import { useSelector } from "react-redux";
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' } 
]

const CatogoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
]

function UploadVideoPage(props) {
    const user = useSelector(state => state.user);

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Privacy, setPrivacy] = useState(0);
    const [Categories, setCategories] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");
    
    //e : event
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDecsriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivacy(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategories(e.currentTarget.value)
    }

    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
       //console.log(files)
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                   //console.log(response.data)

                   let variable = {
                       url: response.data.filePath,
                       fileName: response.data.fileName
                   }

                   setFilePath(response.data.filePath)

                   Axios.post('/api/video/thumbnail', variable)
                   .then(response => {
                    //console.log(variable)
                        if (response.data.success) {
                            
                            setDuration(response.data.fileDuration);
                            setThumbnailPath(response.data.url);

                        } else {
                            alert('썸네일 생성에 실패했습니다. 파일을 확인해주세요.');
                        }
                    })

                }else{
                    alert('파일업로드에 실패했습니다. 파일을 확인해주세요.');
                }
            })

    }

    const onSubmit = (e) => {
        e.preventDefault();
        
        const variable = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Privacy,
            filePath: FilePath,
            category: Categories,
            duration: Duration,
            thumbnail: ThumbnailPath

        }

        Axios.post('/api/video/uploadVideo', variable)
            .then(response => {
                if(response.data.success) {
                    
                    message.success("성공적으로 업로드를 했습니다.");
                    
                    setTimeout(() => {
                     props.history.push("/");
                    }, 2000);

                }else{
                    alert('파일업로드에 실패했습니다. 파일을 확인해주세요.');
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}> 
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="Thumbnail" />
                        </div>
                    }
                </div>

                <br /><br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={onDecsriptionChange}
                    value={Description}
                />
                <br /><br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br /><br />

                <select onChange={onCategoryChange}>
                    {CatogoryOptions.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>
                <br /><br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default UploadVideoPage