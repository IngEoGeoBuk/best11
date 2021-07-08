import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { HomeBoardType } from '../types'
import { Paper, Typography } from '@material-ui/core';
import { ThumbUpAlt, ThumbDown } from '@material-ui/icons';
import Axios from 'axios';
import ReactPaginate from 'react-paginate';

export const getServerSideProps = async () => {
  const { data } = await Axios.get(`${process.env.SERVER_URL}/api/board`)
  return {
    props: {
      boards: data.data
    }
  }
}

const Home = ({boards}: HomeBoardType) => {

    /// 전체에서 좋아요 싫어요 불러오기(왜인지는 몰라도 import로 불러오면 반응을 못함) ///
    const ReadLike: React.FC<getProps> = ({ poId }) => {
      const [readLike, setReadLike] = useState<number>(0);
      useEffect(() => {
          // 전체 좋아요 & 싫어요 갯수
          Axios.get(`${process.env.SERVER_URL}/api/like/${poId}`)
              .then((res) => (
                  setReadLike(res.data.data.length)
              ))
              .catch((error) => console.log('이 영상엔 좋아요 또는 싫어요가 없습니다.'))
      }, [])

      return (
          <Typography style={{ padding: '0px 10px' }}>
              {readLike}
          </Typography>
      )
  }

  const ReadDislike: React.FC<getProps> = ({ poId }) => {
      const [ReadDislike, setReadDislike] = useState<number>(0);

      useEffect(() => {
          // 전체 싫어요 갯수
          Axios.get(`${process.env.SERVER_URL}/api/dislike/${poId}`)
              .then((res) => (
                  setReadDislike(res.data.data.length)
              ))
              .catch((error) => console.log('이 영상엔 좋아요 또는 싫어요가 없습니다.'))
      }, [])

      return (
          <Typography style={{ padding: '0px 10px' }}>
              {ReadDislike}
          </Typography>
      )
  }

  // 페이징 
  const [pageNumber, setPageNumber] = useState(0);
  // 한 페이지에 5개만 보이도록 5로 설정
  const postPerPage = 5;
  const pagesVisited = pageNumber * postPerPage;

  const displayedBoards = boards
  .slice(pagesVisited, pagesVisited + postPerPage)
  .map((board) => {
    return (
      <div key={board._id}>
      <Paper elevation={2} style={{ padding: '10px', margin: '20px' }} >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href={`/${board._id}`}>
            <Typography style={{ cursor: 'pointer' }}>{board.title}</Typography>
          </Link>
          <div style={{ display: 'flex', padding: '0 10px' }}>
            <div style={{ display: 'flex' }}>
              <ThumbUpAlt style={{ padding: '0 5px' }}  />
              <ReadLike poId={board._id}/>
            </div>
            <div style={{ display: 'flex', padding: '0 10px' }}>
              <ThumbDown style={{ padding: '0 5px' }} />
              <ReadDislike poId={board._id}/>
            </div>
          </div>
        </div>
      </Paper>
    </div>
    )
  })

  const pageCount = Math.ceil(boards.length / postPerPage);

  const changePage = ({ selected }) => {
      setPageNumber(selected);
  };

  return (
    <div className="App">
        {displayedBoards}
        <div className={styles.pagination}>
        <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            pageCount={pageCount}
            onPageChange={changePage}
            breakLabel={"..."}
            breakClassName={"break-me"}
            marginPagesDisplayed={5}
            pageRangeDisplayed={5}
            containerClassName={styles.pagination}
            // activeClassName={"active"}
            disabledClassName={"paginationDisabled"}
            activeClassName={styles.paginationActive}
        />
        </div>
    </div>
  );
}

export default Home
