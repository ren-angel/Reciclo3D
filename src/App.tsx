import React from 'react'
import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import RoutesIndex from './routes/index';

export default function App() {

  return (
    <div>
      <CookiesProvider>
        <RoutesIndex />
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
        />
      </CookiesProvider>
    </div>
  )
}
