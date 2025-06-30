'use client'
import { useState } from 'react';

export default () => {
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    const togglePrivacyPolicy = () => {
        setShowPrivacyPolicy(!showPrivacyPolicy);
    };

    return (
        <section className="max-w-xl mt-12 mx-auto px-4 md:px-8">
            <div className="space-y-3 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
                <h3 className="text-3xl text-gray-800 font-bold">
                    Subscribe to Our Newsletter
                </h3>
                <p className="text-gray-500 leading-relaxed">
                    Stay up to date with our roadmap progress, announcements, and exclusive discounts. Feel free to sign up with your email.
                </p>
            </div>
            <div className="mt-6">
                <form className="flex flex-col sm:flex-row items-center justify-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="text-gray-500 w-full p-3 rounded-md border outline-none focus:border-indigo-600"
                    />
                    <button
                        type="submit"
                        className="w-full mt-3 sm:mt-0 sm:ml-3 px-5 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 duration-150 outline-none shadow-md focus:shadow-none focus:ring-2 ring-offset-2 ring-indigo-600 sm:w-auto"
                    >
                        Subscribe
                    </button>
                </form>
                <p className="mt-3 mx-auto text-center max-w-lg text-sm text-gray-400">
                    No spam ever. We care about the protection of your data.
                    <button
                        className="text-indigo-600 underline"
                        onClick={togglePrivacyPolicy}
                    >
                        Privacy Policy
                    </button>
                </p>
            </div>
            {showPrivacyPolicy && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg">
                        <h3 className="text-gray-800 text-xl font-semibold mb-4">Privacy Policy</h3>
                        <p className="text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi venenatis sollicitudin quam ut tincidunt. Duis sodales nisi id porta lacinia.
                        </p>
                        <div className="mt-4 text-right">
                            <button
                                className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                                onClick={togglePrivacyPolicy}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
