import Axios from 'axios'
import React, {useEffect, useState} from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {

        let varialbe = { userTo : props.userTo}

        Axios.post('/api/subscribe/subscribeNumber', varialbe)
        .then(response => {
            if (response.data.success) {
                setSubscribeNumber(response.data.SubscribeNumber);
            } else {
                alert('구독자 수를 가져오는데 실패했습니다.')
            }
        })

        const subscribedVarialbe = { userTo : props.userTo, userFrom : localStorage.getItem('userId')}

        Axios.post('/api/subscribe/subscribed', subscribedVarialbe)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data);
                    setSubscribed(response.data.Subscribed);
                } else {
                    alert('구독목록을 가져오는데 실패했습니다.')
                }
            })
    }, [])

    const onSubscribe = () => {

        let subscribedVarialbe = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        
        //구독취소
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribedVarialbe)
            .then(response => {
                if(response.data.success){ 
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed)
                    
                } else {
                    alert('구독 취소에 실패했습니다.')
                }
            })

        //구독
        }else{
            console.log(Subscribed);
            Axios.post('/api/subscribe/subscribe', subscribedVarialbe)
            .then(response => {
            if (response.data.success) {
                //console.log(SubscribeNumber);
                setSubscribeNumber(SubscribeNumber + 1);
                setSubscribed(!Subscribed);
            } else {
                alert('구독에 실패했습니다.')
            }
            })
        }

    }

    return (
        <div>
        <button 
        onClick={onSubscribe}
        style={{
            backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
            borderRadius: '4px', color: 'white',
            padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
        }}>
            {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
    </div>
    )
}

export default Subscribe