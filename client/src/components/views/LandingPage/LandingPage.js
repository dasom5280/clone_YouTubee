import React from 'react';
import { useSelector } from "react-redux";
import {Icon} from 'antd';

function LandingPage(props) {

    const user = useSelector(state => state.user);
    var name = "";
    if (!user.userData) return null;
    console.log(user.userData);
    if (user.userData.name){
         name = user.userData.name + "님";
    }else{
        name = "환영합니다. 로그인해주세요!";
    }
    return (
        <>
            <div className="app">
                <span style={{ fontSize: '2rem' }}>리액트 포트폴리오 </span>
                <span style={{ fontSize: '2rem' }}>Let's Start REACT</span>
                <span style={{ fontSize: '2rem' }}>{name} <Icon type="smile" /></span>
            </div>
            
            <div style={{ fontSize: '1rem', float: 'right' }}>by HDS</div>
        </>
    )
}

export default LandingPage
