import Container from '@material-ui/core/Container';
import Header from './Header'
import Footer from './Footer'
import G_Login from './G_Login'

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
    return (
        <Container maxWidth="lg" style={{ padding: '0px' }}>
            <div style={{ textAlign: 'right' }}>
                <G_Login />
            </div>
            <Header />
                { children }
            <Footer />
        </Container>
    )
}

export default Layout
