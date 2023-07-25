import Link from 'next/link';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './layout/Navbar';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {serverConfig} from '../config/serverConfig';
import Router from 'next/router';

export default function Register() {
    const {register, handleSubmit} = useForm();
    const [errors, setErrors] = useState({});
    const [files, setFile] = useState([]);

    const onSubmit = async (e) => {
        e.photos = files;
        setErrors({});
        const validationErrors = validateForm(e);
        if (Object.keys(validationErrors).length === 0) {
            axios.post(`${serverConfig.API_URL}/users/register`, e, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                toast.success(res.data.msg);
                Router.push("/success");
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
                case 'firstName':
                    const firstName = Object.values(data)[k];
                    if (!firstName) errors.firstName = 'First Name is required!';
                    else if (firstName.length < 2 || firstName.length > 25) errors.firstName = 'First Name must be between 2 and 25 characters.';
                    break;
                case 'lastName':
                    const lastName = Object.values(data)[k];
                    if (!lastName) errors.lastName = 'Last Name is required!';
                    else if (lastName.length < 2 || lastName.length > 25) errors.lastName = 'Last Name must be between 2 and 25 characters.';
                    break;
                case 'photos':
                    const photos = Object.values(data)[k];
                    if (photos.length < 4) errors.photos = 'You must upload at least 4 photos.';
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

    const handleFile = (e) => {
        let file = e.target.files;
        for (let i = 0; i < file.length; i++) {
            const fileType = file[i]['type'];
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            if (validImageTypes.includes(fileType)) {
                setFile([...files,file[i]]);
            } else {
                toast.warning('Imvalid Image.');
            }
        }
    }; 
    const removeImage = (i) => {
       setFile(files.filter(x => x.name !== i));
    }

    return (
        <>
            <Navbar/>
            <section className="text-center">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0" style={{minHeight: 'calc(100vh - 4rem)'}}>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-700 md:text-2xl dark:text-white">
                                Create an Account
                            </h1>
                            <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4 md:space-y-6" action="#">
                                <div className='text-left'>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Your Email</label>
                                    <input {...register('email')} className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required="" />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Your First Name</label>
                                    <input {...register('firstName')} className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="First Name" required="" />
                                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Your Last Name</label>
                                    <input {...register('lastName')} className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Last Name" required="" />
                                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Password</label>
                                    <input {...register('password')} placeholder="••••••••" type='password' className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>

                                <div className='text-left'>
                                    <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Avatar</label>
                                    <input {...register('avatar')} type='file' placeholder="Choose File" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="photos" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Photos</label>
                                    <input onChange={handleFile} type='file' multiple placeholder="Choose File" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                    {errors.photos && <p className="text-red-500 text-sm">{errors.photos}</p>}
                                    <div className="flex flex-wrap gap-2 mt-2">

                                        {files.map((file, key) => {
                                            return (
                                                <div key={key} className="overflow-hidden relative">
                                                    <span onClick={() => { removeImage(file.name)}} className="mdi mdi-close absolute right-1 hover:text-white cursor-pointer">&times;</span>            
                                                    <img className="h-20 w-20 rounded-md" src={URL.createObjectURL(file)}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
                                <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
                                    Already have an account  <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
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
