import React, { useState, useEffect } from 'react'
import { ThumbUpAltOutlined, ThumbDownAltOutlined, ThumbUpAlt, ThumbDown } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { LikeDislikeType } from '../types'
import Axios from 'axios';

const Like_Dislike = ({ poId, email } : LikeDislikeType) => {

    // 로그인 체크 //
    const [yourEmail, setYourEmail] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(false);

    // 좋아요 싫어요 여부
    const [yourLiked, setYourLiked] = useState<string>('');
    const [yourDisliked, setYourDisliked] = useState<string>('');
    const [readLike, setReadLike] = useState<number>(0);
    const [readDislike, setReadDislike] = useState<number>(0);

    const checkLogin = async () => {
        await Axios.get(`${process.env.SERVER_URL}/api/login/isLogin`)
        .then((res) => {
            if(res.data) {
                setYourEmail(res.data.email)
                const tmp_email = res.data.email
                setIsLogin(true)
                // 너가 좋아요를 눌렀는지 안 눌렀는지
                Axios.post(`${process.env.SERVER_URL}/api/like/${poId}/${tmp_email}`, {
                    poId, email: tmp_email
                })
                .then((res) => {
                    if(res.data.data[0]) {
                        setYourLiked(res.data.data[0]._id)
                    }
                })
                .catch((err) => { console.log(err) })
                // 너가 싫어요를 눌렀는지 안 눌렀는지
                Axios.post(`${process.env.SERVER_URL}/api/dislike/${poId}/${tmp_email}`, {
                    poId, email: tmp_email
                })
                .then((res) => {
                    if(res.data.data[0]) {
                        setYourDisliked(res.data.data[0]._id)
                    }
                })
                .catch((err) => { console.log(err) })
                // 전체 좋아요 갯수
                Axios.get(`${process.env.SERVER_URL}/api/like/${poId}`)
                .then((res) => { 
                    setReadLike(res.data.data.length)
                 })
                 // 전체 싫어요 갯수
                 Axios.get(`${process.env.SERVER_URL}/api/dislike/${poId}`)
                 .then((res) => { 
                    setReadDislike(res.data.data.length)
                  })
            } else {
                setIsLogin(false);
            }
        })
    }




    const iconStyle = {
        padding: '10px', cursor: 'pointer', width: '50px', height: '50px'
    }

    const upLike = async () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.')
            return false;
        } else {
            // 이미 싫어요가 눌러져 있을 경우, 싫어요 취소한 뒤, 좋아요 증가시키기
            if(yourDisliked) {
                await Axios.delete(`${process.env.SERVER_URL}/api/dislike/${yourDisliked}`)
                .then((res) => {
                    setYourDisliked('')
                    setReadDislike(readDislike - 1)
                })
                .catch((err) => { console.log(err) })
            }
            await Axios.post(`${process.env.SERVER_URL}/api/like`, {
                email, poId
            })
            .then((res) => { 
                setYourLiked(res.data.data._id) 
                setReadLike(readLike + 1)
            })
            .catch(err => console.log(err))
        }
    }


    const upDislike = async () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.')
            return false;
        } else {
            // 이미 좋아요가 눌러져 있을 경우, 좋아요 취소한 뒤, 싫어요 증가시키기
            if(yourLiked) {
                await Axios.delete(`${process.env.SERVER_URL}/api/like/${yourLiked}`)
                .then((res) => {
                    setYourLiked('')
                    setReadLike(readLike - 1)
                })
                .catch((err) => { console.log(err) })
            }
            await Axios.post(`${process.env.SERVER_URL}/api/dislike`, {
                email, poId
            })
            .then((res) => { 
                setYourDisliked(res.data.data._id) 
                setReadDislike(readDislike + 1)
            })
            .catch(err => console.log(err))
        }
    }

    const unLike = async () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.');
            return false;
        } else {
            await Axios.delete(`${process.env.SERVER_URL}/api/like/${yourLiked}`)
            .then((res) => {
                setYourLiked('')
                setReadLike(readLike - 1)
            })
            .catch((err) => { console.log(err) })
        }
    }

    const unDislike = async () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.');
            return false;
        } else {
            await Axios.delete(`${process.env.SERVER_URL}/api/dislike/${yourDisliked}`)
            .then((res) => {
                setYourDisliked('')
                setReadDislike(readDislike - 1)
            })
            .catch((err) => { console.log(err) })
        }
    }


    useEffect(() => {
        checkLogin()
    }, [])

    return (
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
            {yourLiked ? 
            <ThumbUpAlt
                style={iconStyle}
                onClick={() => unLike()}
            /> :             
            <ThumbUpAltOutlined
                style={iconStyle}
                onClick={() => upLike()}
            />            
            }
            {yourDisliked ?
            <ThumbDown 
                style={iconStyle}
                onClick={() => unDislike()} 
            /> :
            <ThumbDownAltOutlined
                style={iconStyle}
                onClick={() => upDislike()} 
            /> 
            }
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                <Typography style={{ padding: '0px 10px' }}>
                    {readLike}
                </Typography>
                <Typography style={{ padding: '0px 10px' }}>
                    {readDislike}
                </Typography>
            </div>
        </div>
    )
}

export default Like_Dislike
