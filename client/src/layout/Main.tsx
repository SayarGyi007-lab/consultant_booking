import { Bounce, ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import { Header } from '../constant/lazyload'

function Main() {
    return <section >
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
        />
        <Header />
        <Outlet />

    </section>
}

export default Main