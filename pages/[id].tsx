import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { ReadBoardType, CommentType } from '../types'
import { 
    Paper, 
    OutlinedInput, 
    Button, 
    Typography,
    Card,
    Grid,
} from '@material-ui/core';
import PlayerBox from '../components/PlayerBox';
import styles from '../styles/createBoard.module.css'
import { useRouter } from 'next/router'
import {
    Delete,
    Edit,
    Check,
    Close, 
    Reply, 
} from '@material-ui/icons'
import Link from 'next/link'
import moment from 'moment';
import Like_Dislike from '../components/Like_Dislike';
import Axios from 'axios';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context?.params?.id;
    const boardData = await Axios.get(`${process.env.SERVER_URL}/api/board/${id}`)

    const playersData = await Axios.post(`${process.env.SERVER_URL}/api/player`, {
        players: boardData.data.data[0].players
    })
    const commentsData = await Axios.get(`${process.env.SERVER_URL}/api/comment/${id}`)
    const repplyData = await Axios.get(`${process.env.SERVER_URL}/api/repply/${id}`)


    return {
        props: { 
            boards: boardData.data.data,
            players: playersData.data.data,
            comments: commentsData.data.data,
            repplys: repplyData.data.data,
        }
    }
}

const IconStyles = {
    cursor: 'pointer', display: 'flex'
}


const Details = ({ boards, players, comments, repplys } : ReadBoardType) => {

    const router = useRouter();
    // 로그인 체크 //
    const [yourEmail, setYourEmail] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        Axios.get(`${process.env.SERVER_URL}/api/login/isLogin`)
        .then((res) => {
            if(res.data) {
                setYourEmail(res.data.email);
                setIsLogin(true);      
            }
        })
    }, [])

    /// 선수들 리스트
    const rows = (a: number, b: number) =>     
    <div className={styles.teamLine}>
        {players.map((player, key:number) => {
            if(key >= a && key <= b) {
                return (
                    <Card className={styles.plyerBoxSize} key={key}>
                        <PlayerBox 
                            _id={player._id}
                            no={player.no}
                            name={player.name}
                            club={player.club}
                            logo={player.logo}
                        />
                    </Card>
                )
            }
        })}
    </div>

    const firstRow = rows(0, 2);
    const secondRow  = rows(3, 5);
    const thridRow  = rows(6, 9);
    const fourthRow = rows(10, 10)

    // 글 삭제 
    const deleteBoard = async (id : string) => {
        await Axios.delete(`${process.env.SERVER_URL}/api/board/${id}`)
        .then((res) => {
            alert('삭제되었습니다.')
            router.push('/')
        })
        .catch((err) => { console.log(error) })
    }

    ////////// 댓글 부분 /////////////////
    const [commentContext, setCommentContext] = useState<string>('');
    const [commentList, setCommentList] = useState<CommentType[]>(comments);
    // 수정당할 댓글 
    const [targetComment, setTargetComment] = useState<string>('');
    const [showUpdateComment, setShowUpdateComment] = useState<boolean>(false);
    const [newCommentContext, setNewCommentContext] = useState<string>(commentContext);

    const createComment = async (poId: string) => {
        const time = moment().format('YYYY-MM-DD:HH:mm:ss');
        await Axios.post(`${process.env.SERVER_URL}/api/comment`, {
            poId,
            email: yourEmail, 
            context: commentContext,
            time
        }).then((res) => {
            setCommentList([
                ...commentList, res.data.data
            ])
            setCommentContext('')
            setShowUpdateComment(false)
            setNewCommentContext('')
        }).catch((err) => { console.log(err) })
    }

    const deleteComment = async (id: string) => {
        await Axios.delete(`${process.env.SERVER_URL}/api/comment/${id}`)
        .then((res) => {
            setCommentList(commentList.filter((val : CommentType) => {
                return val._id !== id;
            }))
            setRepplyList(repplyList.filter((val : CommentType) => {
                return val._id !== id;
            }))
        })
        .catch((err) => { console.log(err) })
    }

    const updateComment = async (id: string) => {
        const time = moment().format('YYYY-MM-DD:HH:mm:ss');
        await Axios.put(`${process.env.SERVER_URL}/api/comment/${id}`, {
            context: newCommentContext, 
            updated_time: time 
        }).then((res) => {
            setCommentList(commentList.map((val: CommentType) => {
                return val._id === id 
                ? {
                    _id: res.data.data._id, 
                    poId: res.data.data.poId, 
                    email : res.data.data.email, 
                    context: res.data.data.context, 
                    time: res.data.data.time,
                    updated_time: res.data.data.updated_time
                } 
                : val
            }))
            setRepplyList(repplyList.map((val: CommentType) => {
                return val._id === id 
                ? {
                    _id: res.data.data._id, 
                    coId: res.data.data.coId, 
                    poId: res.data.data.poId, 
                    email : res.data.data.email, 
                    context: res.data.data.context, 
                    time: res.data.data.time,
                    updated_time: res.data.data.updated_time
                } 
                : val
            }))
            setTargetComment('')
        })
    }

    // 답글 부분 //
    const [showReplyBox, setShowReplyBox] = useState<string>('');
    const [repply, setRepply] = useState<string>('');
    const [repplyList, setRepplyList] = useState<commentTypes[]>(repplys);
    const createRepply = async (poId: string, coId : string) => {
        const time = moment().format('YYYY-MM-DD:HH:mm:ss');
        if (!repply) {
            alert("댓글 내용을 입력해주세요.");
            return false;
        }
        await Axios.post(`${process.env.SERVER_URL}/api/comment`, {
            poId, coId, email: yourEmail, context: repply, time
        }).then((res: any) => {
            setRepplyList([
                ...repplyList, res.data.data
            ])
        })
        setShowReplyBox('')
        setRepply('');
    }

    return (
        <div>
            <Head>
                <title>MyBest11</title>
                <meta name="description" content="make your own best11" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {boards.map((board) => {
                return (
                    <Paper key={board._id} className={styles.paper}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>제목: {board.title}</Typography>
                            
                            {yourEmail === board.email ?
                                <div className={styles.iconStyle}>
                                    <div style={IconStyles}>
                                        <Delete/>
                                        <Typography onClick={() => { 
                                            if(window.confirm('게시글을 삭제하시겠습니까?'))
                                            deleteBoard(board._id) 
                                        }}>
                                            삭제
                                        </Typography>
                                        <div>&nbsp;&nbsp;&nbsp;</div>
                                        <Link href={`board/${board._id}`}>
                                            <div style={IconStyles}>
                                                <Edit />
                                                <Typography>수정</Typography>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                :
                                <div></div>
                            }
                        </div>
                        <Typography>작성자: {board.email}</Typography>
                        <Typography>작성시간: {board.time}</Typography>
                        {board.updated_time? 
                            <Typography>수정시간: {board.updated_time}</Typography>
                            : <div></div>    
                        }
                        <br/><br/>
                        {firstRow}
                        {secondRow}
                        {thridRow}
                        {fourthRow}
                        <Like_Dislike email={yourEmail} poId={board._id} />
                        <br/><br/>
                        <Typography>내용: </Typography>
                        <div>
                            {board.contents}
                        </div>
                    </Paper>
                )
            })}
            <br/><br/>
            {isLogin ? 
            <div>
                <div style={{ paddingBottom: '10px' }}>
                    <OutlinedInput
                        style={{ width: '75%' }}
                        type="text"
                        onChange={(e) => {
                            setCommentContext(e.target.value);
                        }}
                        value={commentContext}
                    />
                </div>
                <Button variant="contained" 
                    onClick={() => { 
                        createComment(boards[0]._id)
                    }}
                >
                    댓글달기
                </Button>
            </div>
            : <div></div>
            }
            <br/>    
            {commentList.map((comment) => {
                return (
                    <div key={comment._id}>
                        <Paper style={{ padding: '10px', margin: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">작성자: {comment.email}</Typography>
                            {yourEmail === comment.email ?
                                <div style={IconStyles}>
                                    <div style={{ display: 'flex' }} 
                                        onClick={() => {
                                            if(window.confirm('댓글을 삭제하시겠습니까?'))
                                            deleteComment(comment._id)}
                                        }
                                    >
                                        <Delete />
                                        <Typography>삭제</Typography>
                                    </div>
                                    <div>&nbsp;&nbsp;&nbsp;</div>
                                    <div style={{ display: 'flex' }}
                                        onClick={() => {
                                            setTargetComment(comment._id);
                                            setShowUpdateComment(!showUpdateComment);
                                        }}>
                                        <Edit />
                                        <Typography>수정</Typography>
                                    </div>
                                </div> 
                                : <div></div> 
                            }
                        </div>
                        <Typography>{comment.context}</Typography>
                        <Typography>작성시간:  {comment.time}</Typography>
                        {comment.updated_time ? 
                            <Typography>수정시간: {comment.updated_time}</Typography> : <div></div>
                        }
                        {comment._id === targetComment && showUpdateComment ?
                        <div>
                            <div>
                                <OutlinedInput
                                    type="text"
                                    style={{ width: '75%' }}
                                    onChange={(e) => {
                                        setNewCommentContext(e.target.value);
                                    }}
                                    value={newCommentContext}
                                />
                            </div>
                            <div style={{ display: 'flex', padding: '10px' }}>
                                <div
                                    onClick={() => { updateComment(comment._id) }}
                                    style={IconStyles}
                                >
                                    <Check />
                                    <Typography>수정하기</Typography>
                                </div>
                                <div
                                    onClick={() => {
                                        setTargetComment('');
                                        setShowUpdateComment(!showUpdateComment);
                                        setNewCommentContext('')
                                    }}
                                    style={IconStyles}
                                >
                                    <Close />
                                    <Typography>수정취소</Typography>
                                </div>

                            </div>
                        </div> 
                        : <div></div> 
                        }    
                        <br/>
                        {yourEmail ? 
                        <>
                            {showReplyBox === comment._id ? 
                                <div style={IconStyles} onClick={() => { setShowReplyBox('') }}>
                                    <div style={IconStyles}><Close /><Typography>답글취소</Typography></div>
                                </div>
                                : 
                                <div style={IconStyles} onClick={() => { setShowReplyBox(comment._id) }}>
                                    <div style={IconStyles}><Reply /><Typography>답글</Typography></div>
                                </div>
                            }
                        </>: <div></div>
                        }
                        </Paper>
                        {showReplyBox === comment._id ?
                            <div>
                                <div style={{ paddingBottom: '10px' }}>
                                    <OutlinedInput
                                        style={{ width: '75%' }}
                                        type="text"
                                        onChange={(e) => {
                                            setRepply(e.target.value);
                                        }}
                                        value={repply}
                                    />
                                </div>
                                <Button
                                    variant="contained"
                                    onClick={() => { createRepply(comment.poId, comment._id)}}
                                >
                                    답글달기
                                </Button>
                            </div>
                            : 
                            <div></div>
                        }
                        <div style={{ width: '95%', paddingLeft: '5%' }}>
                            {repplyList.map((repply: commentTypes, key: number) => {
                                return (
                                    <div key={repply._id}>
                                        {comment._id === repply.coId ?
                                            <Paper style={{ margin: '20px 0px' }} elevation={5} >
                                                <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography>작성자: {repply.email}</Typography>
                                                    {yourEmail === repply.email ? 
                                                        <div style={{ display: 'flex' }}>
                                                            <div
                                                                onClick={() => {
                                                                    setTargetComment(repply._id);
                                                                    setShowUpdateComment(!showUpdateComment);
                                                                }}
                                                                style={IconStyles}
                                                            >
                                                                <Edit />
                                                                <Typography>수정</Typography>
                                                            </div>
                                                            &emsp;
                                                            <div 
                                                                style={IconStyles}
                                                                onClick={() => { deleteComment(repply._id) }}
                                                            >
                                                                <Delete />
                                                                <Typography>삭제</Typography>
                                                            </div>
                                                        </div> : 
                                                        <div></div>
                                                    }    
                                                </div>                                    
                                                <Typography>{repply.context}</Typography>
                                                <Typography>작성시간 {repply.time}</Typography>
                                                <Typography>수정시간: {repply.updated_time}</Typography>
                                                {repply._id === targetComment && showUpdateComment ?
                                                    <div>
                                                        <div>
                                                            <OutlinedInput
                                                                type="text"
                                                                style={{ width: '75%' }}
                                                                onChange={(e) => {
                                                                    setNewCommentContext(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{ display: 'flex', padding: '10px' }}>
                                                            <div
                                                                onClick={() => { updateComment(repply._id!) }}
                                                                style={IconStyles}
                                                            >
                                                                <Check />
                                                                <Typography>수정하기</Typography>
                                                            </div>
                                                            <div
                                                                onClick={() => {
                                                                    setTargetComment('');
                                                                    setShowUpdateComment(!showUpdateComment);
                                                                }}
                                                                style={IconStyles}
                                                            >
                                                                <Close />
                                                                <Typography>취소</Typography>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    : <div></div>
                                                }
                                            </Paper>
                                            :<div></div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Details

