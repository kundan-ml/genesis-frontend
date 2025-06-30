import React, { useState } from 'react';
import useAuthRedirect from '@/utils/useAuthRedirect';
import { useAuth } from '@/utils/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Alert from '../Alert';

const ContactForm = () => {
    const { token } = useAuthRedirect();
    const { username } = useAuth();
    const BACKEND_URL = process.env.BACKEND_URL;
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            username
        };

        try {
            const response = await axios.post(`${BACKEND_URL}/api/contact/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setAlert({ show: true, message: 'Message sent successfully!', type: 'success' });
                setTimeout(() => {
                    setAlert({ show: false, message: '', type: '' });
                    router.push('/');
                }, 3000);
            
            
            } else {
                setAlert({ show: true, message: 'Failed to send the message. Please try again.', type: 'error' });
            }
        } catch (error) {
            console.error('There was an error submitting the form!', error);
            setAlert({ show: true, message: 'Failed to send the message. Please try again.', type: 'error' });
        }
    };

    const contactMethods = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:text-neutral-400 text-gray-600 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ),
            contact: "Support@emagegroup.com"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-neutral-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
            ),
            contact: "+91 0000000000"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-neutral-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            ),
            contact: "Bengaluru, India."
        },
    ];

    return (
        <main className="py-24 ">
            <div className="max-w-screen-xl mx-auto px-4 dark:text-neutral-300 text-gray-700 md:px-8">
                {alert.show && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ show: false, message: '', type: '' })}
                    />
                )}
                <div className="max-w-lg mx-auto gap-12 justify-between lg:flex lg:max-w-none">
                    <div className="max-w-lg space-y-3">
                        <h3 className="dark:text-indigo-400 text-indigo-600 font-semibold">Contact</h3>
                        <p className="dark:text-white text-black text-3xl font-semibold sm:text-4xl">
                            Let us know how we can help
                        </p>
                        <p>
                            We’re here to help and answer any question you might have. We look forward to hearing from you! Please fill out the form, or use the contact information below.
                        </p>
                        <div>
                            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-6 items-center">
                                {contactMethods.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-x-3">
                                        <div className="flex-none">
                                            {item.icon}
                                        </div>
                                        <p>{item.contact}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex-1 mt-12 sm:max-w-lg lg:max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-5 dark:bg-neutral-900 bg-white border p-6 rounded-lg shadow-lg">
                            <div>
                                <label className="font-medium dark:text-neutral-300 text-gray-700 ">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 px-3 py-2 dark:text-neutral-200 text-gray-700 dark:bg-neutral-700 bg-gray-200 outline-none border dark:border-neutral-600 border-gray-400 focus:border-indigo-500 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium dark:text-neutral-300 text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 px-3 py-2 dark:text-neutral-200 text-gray-700 dark:bg-neutral-700 bg-gray-200 outline-none border dark:border-neutral-600 focus:border-indigo-500 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium dark:text-neutral-300 text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 px-3 py-2 dark:text-neutral-200 text-gray-700 dark:bg-neutral-700 bg-gray-200 outline-none border dark:border-neutral-600 focus:border-indigo-500 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium dark:text-neutral-300 text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none dark:text-neutral-200 text-gray-700 dark:bg-neutral-700 bg-gray-200 outline-none border dark:border-neutral-6000 focus:border-indigo-500 shadow-sm rounded-lg"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg duration-150"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ContactForm;
