import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import Router from 'next/router'

export default function Success() {
  const login = () => {
    Cookies.remove('token')
    Router.push('/login')
  }

  return (
    <div className='w-full h-screen flex items-center justify-center text-white bg-indigo-700 flex-col tracking-widest uppercase'>
      <p className='text-4xl font-extrabold mb-4'>Welcome to Success Page</p>
      <button onClick={login} className='bg-white border-2 border-white hover:bg-transparent transition-all text-indigo-700 hover:text-white font-semibold text-lg  px-4 py-2 rounded duration-700 '>Login</button>
    </div>
  )
}
