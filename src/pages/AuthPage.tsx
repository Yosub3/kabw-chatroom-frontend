'use client'

import react, { useEffect } from 'react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { checkAuth, login, register } from '@/services/auth';
import { RegisterData } from '@/interfaces/IAuth';
import LoadingSpinnerButton from '@/ui/LoadingSpinnerButton';
import Modal from '@/ui/Modal';

const AuthPage = () => {
    const [type, setType] = useState<"login" | "register">("login");
    const [showPwd, setShowPwd] = useState(false);
    const termsCheckboxRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterData>({
        name: "",
        email: "",
        password: ""
    });

    const isLogin = type ==="login";

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            let response;
            if(isLogin){
                response = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                if(!termsCheckboxRef.current?.checked){
                    setErrors({general: "You must agree to the terms and conditions"});
                    return;
                }
                response = await register({
                    ...formData
                });
            }

            const token = response.data.token;
            console.log({token})
            localStorage.setItem("token", token);
            console.log({response, token})
            router.push("/chatroom");
            return;
        } catch (error) {
            if(error instanceof Error){
                setErrors({general: error.message});
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(checkAuth()){
            router.push("/chatroom");
        }
    },[])
    
    return(
        /* Main container and background */
        <div className='min-h-screen flex justify-center items-center bg-gray-100 px-4 py-12'>
            {/* Components parent */}
            <div className='grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden'>

                {/* Left Grid (box) */}
                <div className='p-8 sm:p-12 min-h-[600px] flex flex-col justify-center'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                        {isLogin ? "Sign In" : "Register"}
                    </h2>
                    <p className='text-sm text-gray-600 mb-4'>
                        {isLogin ? "Welcome back!" : "Let's sign up to get started!"}
                    </p>
                    {/* FORM */}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {/* Added input element for inputing name and number when registering */}
                        {!isLogin && (
                        <div>
                            {/* Name */}
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Name</label>
                            <input 
                                type="text" 
                                id='name'
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder='John Doe' 
                                className='w-full mt-1 px-4 py-2 border border-gray-500 rounded-md'
                            />
                        </div>
                        )}

                        <div>
                            {/* Email */}
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                            <input 
                                type="text" 
                                id='email'
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder='johndoe@mail.com' 
                                className='w-full mt-1 px-4 py-2 border border-gray-500 rounded-md'
                            />
                        </div>
                        <div>
                            {/* Password */}
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password</label>
                            <div className='relative'>
                                <input 
                                    type={showPwd ? "text" : "password"} 
                                    id='password'
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder='Enter your password' 
                                    className='w-full mt-1 px-4 py-2 border rounded-md'
                                />
                                <button 
                                    type='button' 
                                    className=' absolute right-3 top-1/2 -translate-y-1/3 text-gray-500'
                                    onClick={() => setShowPwd(!showPwd)}
                                >
                                    {showPwd ? <AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/> }
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className='flex items-center gap-2'>
                                <input type="checkbox" name="terms" id="terms" ref={termsCheckboxRef} className='hover:cursor-pointer'/>
                                <label htmlFor="terms">
                                    I agree to the{" "}
                                    <button type='button' onClick={() => setShowModal(!showModal)} className='text-indigo-600 hover:underline hover:cursor-pointer'>
                                        Terms & Privacy Policy
                                    </button>
                                </label>
                            </div>
                        )}
                        {showModal && <Modal type="information" message="Terms and Conditions" onOk={() => setShowModal(false)} />}
                        {errors.general && <p className='text-red-500 text-xs mt-1'>{errors.general}</p>}

                        {/* Submit button */}
                        <button 
                            type='submit' 
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-md flex items-center 
                            justify-center gap-2 
                            ${loading ? 
                            "bg-indigo-400 hover:cursor-not-allowed text-white" : 
                            "bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer text-white"}`
                            }
                        >
                            {
                                loading ? <LoadingSpinnerButton /> : 
                                isLogin ? "Let's explore" : "Begin your journey"
                            }
                        </button>
                    </form>

                    <p className='mt-6 text-sm text-center text-gray-600'>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        {" "}
                        <button 
                            className='text-indigo-600 hover:underline hover:cursor-pointer' 
                            onClick={() => {
                                setType(isLogin ? "register" : "login")
                                errors.general && setErrors({});
                            }}
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </div>

                {/* Right grid (box) */}
                <div className='hidden md:block bg-indigo-600 relative min-h-[600px] w-full'>
                    <Image
                        src='/images/auth-img.png'
                        alt='Auth Image'
                        fill
                        className='object-cover'
                        priority
                    />
                </div>
            </div>

        </div>
    )
}

export default AuthPage;