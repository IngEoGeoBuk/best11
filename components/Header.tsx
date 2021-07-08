import Link from 'next/link'
import styles from '../styles/Header.module.css'
import React, { useState , useEffect } from 'react'
import Axios from 'axios';

const Header = () => {
    // 로그인 체크 //
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        Axios.get(`${process.env.SERVER_URL}/api/login/isLogin`)
        .then((res) => {
            if(res.data.email) {
                setIsLogin(true);      
            }
        })
    }, [])

    const alertLogin = () => {
        alert('로그인을 하셔야 이용 가능합니다.');
        return false
    }

    return (
        <header className={styles.headerStyles}>
            <h2>UCL</h2>
            <nav className={styles.navStyles}>
                <ul className={styles.ulStyles}>
                    <li className={styles.liStyles}>
                        <Link href='/'>
                            <div className={styles.LinkStyles}>Home</div>
                        </Link>
                    </li>
                    <li className={styles.liStyles}>
                        {isLogin ? 
                            <Link href='/board/createBoard'>
                                <div className={styles.LinkStyles}>
                                    Team    
                                </div>
                            </Link> :
                            <div className={styles.LinkStyles} onClick={() => {alertLogin()}}>Team</div>
                        }
                    </li>
                    <li className={styles.liStyles}>
                        <Link href='/best'>
                            <div className={styles.LinkStyles}>
                                Best
                            </div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
