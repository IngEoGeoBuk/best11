import React, { useState , useEffect } from 'react'
import Select, { ValueType } from 'react-select';
import { 
    Paper, 
    OutlinedInput, 
    Button, 
    Grid,
    Typography,
    Card,
} from '@material-ui/core';
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../../styles/createBoard.module.css'
import { UpdateBoardType, PlayerType, OptionType } from '../../types'
import PlayerBox from '../../components/PlayerBox';
import moment from 'moment';
import { GetServerSideProps } from 'next'
import Axios from 'axios';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const playersData = await Axios.get(`${process.env.SERVER_URL}/api/player`)
    const clubsData = await Axios.get(`${process.env.SERVER_URL}/api/club`)

    const id = context?.params?.id;
    const boardData = await Axios.get(`${process.env.SERVER_URL}/api/board/${id}`)
    const prevSelectedPlayersData = await Axios.post(`${process.env.SERVER_URL}/api/player`, {
        players: boardData.data.data[0].players
    })

    return {
        props: { 
            players: playersData.data.data,
            clubs: clubsData.data.data,
            boards: boardData.data.data,
            prevSelectedPlayers: prevSelectedPlayersData.data.data
        }
    }
}


const UpdateBoard = ({ 
        players, clubs, boards, prevSelectedPlayers
    }   : UpdateBoardType) => {



    // 제목과 내용 //
    const [title, setTitle] = React.useState<string>(boards[0].title);
    const [contents, setContents] = useState<string>(boards[0].contents);

    // select 부분 //
    const options = clubs.map((v) => ({ value: v, label: v }))
    const [selectedClub, setSelectedClub] = useState<ValueType<OptionType, false>>(options[0]);
    const onchangeSelect = (item: ValueType<OptionType, false>) => {
        setSelectedClub(item);
    };

    // 선수들 넣고빼고 하는 부분 
    const [playerList, setPlayerList] = useState<PlayerType[]>(players)
    const noContent: PlayerType = { _id: '', no: 0, name: '', club: '', logo: '' };
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerType[]>(prevSelectedPlayers);
    const [targetBox, setTargetBox] = useState<number>(-1);
    const addBoxNum = (num : number) => {
        setTargetBox(num);
    }

    const fillBox = (
        _id: string, 
        no: number, 
        name: string, 
        club:string, 
        logo: string
    ) => {
        if(targetBox !== -1) {
            for(let j = 0; j <= 10; j++) {
                if (targetBox === j) {
                  if(selectedPlayers[j]._id === '') {
                    setSelectedPlayers([
                        ...selectedPlayers.slice(0, j), 
                        { _id, no, name, club, logo }, 
                        ...selectedPlayers.slice(j+1)
                    ])
                    setPlayerList(playerList.filter((val) => {
                      return val._id !== _id;
                    }))
                  }
                }
            }
        }         
    }

    const cancelFill = (
        stId : string, 
        stNo : number,
        stName: string, 
        stClub : string, 
        stLogo: string, 
        boxId: number
    ) => {
        setPlayerList([
            ...playerList,
            {
              _id: stId, no: stNo, name: stName, club: stClub, logo: stLogo
            }
        ])
        for(let j = 0; j <= 10; j++) {
            if(boxId === j) {
                setSelectedPlayers([
                    ...selectedPlayers.slice(0, j), 
                    noContent, 
                    ...selectedPlayers.slice(j+1)
                ])
                setTargetBox(-1);
            }
        }
    }


    /// 선수들 리스트
    const rows = (a: number, b: number) =>     
    <div className={styles.teamLine}>
        {selectedPlayers.map((player, key:number) => {
            if(key >= a && key <= b) {
                return (
                    <Card className={styles.plyerBoxSize} key={key}>
                        {selectedPlayers[key]._id !== '' ?
                            <button onClick={() => 
                                cancelFill(
                                    player._id, 
                                    player.no,
                                    player.name, 
                                    player.club, 
                                    player.logo, 
                                    key
                                )}
                            >
                                X
                            </button> :
                            <button onClick={() => addBoxNum(key)}>
                                {targetBox === key ? 
                                <div>selected</div> : <div>O</div> }
                            </button>
                        }
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

    const editBoard = async () => {
        if(!title) {
            alert('제목을 입력하세요.')
            return false;
        }
        if(!contents) {
            alert('글 내용을 작성하세요.')
            return false;
        }

        const players = [] 
        for(let i = 0; i < 11; i++) {
            if(selectedPlayers[i].name === '') {
              alert('11명을 채워주세요.')
              return false;
            } else {
                players.push(selectedPlayers[i]._id)
            }
        }

        const time = moment().format('YYYY-MM-DD:HH:mm:ss');
        await Axios.put(`${process.env.SERVER_URL}/api/board/${boards[0]._id}`, {
            title, 
            contents,
            players,
            updated_time: time
        }).then((res) => { router.push('/') })
        .catch((err) => { console.log(err) })
    }

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
        for (let i = 0; i < 11; i++) {
            setPlayerList(playerList =>
              playerList.filter((val) => val._id !== selectedPlayers[i]._id)
            )
        }
    }, [])


    return (
        <div>
            <Head>
                <title>MyBest11</title>
                <meta name="description" content="make your own best11" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Paper className={styles.paper}>
                <Typography variant="h6">제목</Typography>
                <input
                    type="text"
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                    maxLength={20}
                    className={styles.input}
                    value={title}
                />
                <br/><br/>
                {/* 선택한 선수들 나타내는 부분  */}
                {firstRow}
                {secondRow}
                {thridRow}
                {fourthRow}
                <Select
                    value={selectedClub}
                    onChange={option => onchangeSelect(option)}
                    options={options}
                    getOptionValue={(option) => String(option.value)}
                    getOptionLabel={(option) => option.label}
                    className={styles.selectBox}
                    readOnly
                />
                {/* 선수들 리스트  */}
                <Grid container spacing={0}>
                    {playerList.map((player : PlayerType) => {
                        if(selectedClub!.value === player.club) {
                            return (
                                <Card 
                                    className={styles.plyerBoxSize} 
                                    key={player._id}
                                    onClick={() => 
                                        fillBox(
                                            player._id, 
                                            player.no, 
                                            player.name, 
                                            player.club,
                                            player.logo
                                        )
                                    }
                                >
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
                </Grid>
                <br/><br/>
                <Typography variant="h6">내용</Typography>
                <textarea
                    onChange={(e) => {
                        setContents(e.target.value);
                    }}
                    className={styles.textarea}
                    value={contents}
                />
                <br/><br/><br/>
                <Button variant="contained" onClick={editBoard}>글 수정</Button>
            </Paper>
        </div>
    )
}

export default UpdateBoard
