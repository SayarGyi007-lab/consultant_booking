import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store.ts'
import { 
  AddConsultant, 
  AddTimeslot, 
  AdminLayout, 
  AllBooking, 
  AllConsultant, 
  AllConsultants, 
  AllTimeslot, 
  AllUser, 
  Booking, 
  ConsultantInfo, 
  Dashboard, 
  Home, 
  LandingPage, 
  LoginPage, 
  Main, 
  MyBookings, 
  Profile, 
  RegisterPage } from './constant/lazyload.ts'
import Protect from './components/Protect.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AddPhonePage from './pages/AddPhone.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/booking',
        element: <Booking />
      },
      {
        path: '/my-bookings',
        element: <MyBookings/>
      },
      {
        path: '/all-consultants',
        element: <AllConsultants/>
      },
      {
        path: '/consultants/:id',
        element: <ConsultantInfo/>
      },
      {
  path: "/add-phone",
  element: <AddPhonePage />
},


      //admin
      {
        path: "/admin",
        element: <Protect adminOnly={true}><AdminLayout /></Protect>,
        children: [
          { 
            index: true, 
            element: <Dashboard /> 
          },
          { 
            path: "create-consultant", 
            element: <AddConsultant /> 
          },
          {
            path: "all-bookings",
            element: <AllBooking />
          },
          {
            path: "all-timeslots",
            element: <AllTimeslot />
          },
          {
            path: "all-consultants",
            element: <AllConsultant />
          },
          {
            path: "all-users",
            element: <AllUser />
          },
          {
            path: "create-timeslot",
            element: <AddTimeslot />
          },
          {
            path: "profile",
            element: <Profile />
          },
        ]
      }
    ]
  }
])
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
  // </StrictMode>,
)
