import { Button } from '@material-ui/core';
import { GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useEffect, useState } from 'react';
import Axios from 'axios';

const G_Login = () => {
    const [yourEmail, setYourEmail] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const checkLogin = async () => {
        await Axios.get(`${process.env.SERVER_URL}/api/login/isLogin`)
        .then((res) => {
            if(res.data.email) {
                setYourEmail(res.data.email);
                setIsLogin(true);      
            } else {
                setIsLogin(false);
            }
        })
    }

    useEffect(() => {
        checkLogin();
    }, [])

    const responseGoogle = async (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('googleId' in res) {
            const profile = await res.getBasicProfile();
            const email = profile.getEmail();
            setYourEmail(email);
            await Axios.post(`${process.env.SERVER_URL}/api/login/login`, {
                email
            })
            .then((res) => { window.location.reload()})
            .catch((err) => { console.log(err) })
        }
    }

    const logout = async () => {
        await Axios.post(`${process.env.SERVER_URL}/api/login/logout`, {
            yourEmail
        })
        .then((res) => { window.location.reload() })
        .catch((err) => { console.log(err) })
    }

    return (
        <>
            {isLogin ? 
            <Button 
                onClick={logout}
                variant="outlined" 
                size='small'
            >
                로그아웃
            </Button> :
            <GoogleLogin
                clientId={`${process.env.GOOGLE_ID}`}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                    <div onClick={renderProps.onClick} style={{ cursor: 'pointer' }}>
                        <Button variant="outlined" 
                            size='small'
                        >
                            로그인
                        </Button>
                    </div>
                )}
            /> 
            }
        </>

    )
}

export default G_Login
