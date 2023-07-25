import Link from 'next/link';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './layout/Navbar';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {serverConfig} from '../config/serverConfig';
import Router from 'next/router';

export default function Login() {
    const {register, handleSubmit} = useForm();
    const [errors, setErrors] = useState({});

    const onSubmit = async (e) => {
        setErrors({});
        const validationErrors = validateForm(e);
        if (Object.keys(validationErrors).length === 0) {
            axios.post(`${serverConfig.API_URL}/users/login`, e, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                toast.success(res.data.msg);
                Router.push("/profile");
            }).catch(err => {
                switch (err.response.status) {
                    case 411:
                        const msg = err.response.data.msg;
                        const showMsg = msg.substring(msg.indexOf(':') + 2, msg.indexOf('(code'))
                        toast.error(showMsg);
                        break;
                    default:
                        toast.error(err.response.data.msg);
                        break;
                }
            })
        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = (data) => {
        // Perform validation checks here and return an object with errors (if any)
        const errors = {};
        Object.keys(data).map((v, k) => {
            switch (v) {
                case 'email':
                    const email = Object.values(data)[k];
                    if (!email) errors.email = 'Email is required!';
                    else if (!isValidEmail(email)) errors.email = 'Invalid email address.';
                    break;
                case 'password':
                    const password = Object.values(data)[k];
                    if (!password) errors.password = 'Password is required!';
                    else if (password.length < 6 || password.length > 50) errors.password = 'Password must be between 6 and 50 characters.';
                    else if (!isValidPassword(password)) errors.password = 'Password must contain at least 1 number.';
                    break;
            }
        });
        return errors;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (Password) => {
        const passwordRegex = /\d/;
        return passwordRegex.test(Password);
    };

    return (
        <>
            <Navbar/>
            <section className="text-center">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0" style={{minHeight: 'calc(100vh - 4rem)'}}>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-700 md:text-2xl dark:text-white">
                                Log In
                            </h1>
                            <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4 md:space-y-6" action="#">
                                <div className='text-left'>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Your Email</label>
                                    <input {...register('email')} className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required="" />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Password</label>
                                    <input {...register('password')} placeholder="••••••••" type='password' className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>

                                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign In</button>
                                <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
                                    You have no account  <Link href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign Up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}
