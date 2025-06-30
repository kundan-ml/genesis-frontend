import React from 'react';

const Steps = () => {
    return (
        <section className="dark:bg-neutral-800 dark:text-gray-300 text-gray-700">
            <div className="max-w-screen-xl mx-auto px-4 py-0 gap-12 md:px-8">
                <section >
                    <div className="container max-w-xl p-6 py-12 mx-auto space-y-24 lg:px-8 lg:max-w-7xl">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-5xl dark:text-gray-100 text-gray-800 ">Steps to Generate Images</h2>
                            <p className="max-w-3xl mx-auto mt-4 text-xl text-center dark:text-gray-600  text-gray-600 ">with the use of our generative AI model - Genie Genesis</p>
                        </div>
                        <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl dark:text-gray-100 text-gray-800">Step-1: Enter Your Prompt and Image Count</h3>
                                <p className="mt-3 text-lg text-gray-600 dark:text-gray-600 ">Enter your prompt and specify the number of images you need to generate.</p>
                                <div className="mt-12 space-y-12">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium leading-6 dark:text-gray-100 text-gray-800">Enter Prompt</h4>
                                            <p className="mt-2 dark:text-gray-600  text-gray-400">Specify your creative prompt to generate images based on your idea.</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-100">Use Multiple Prompts at Once</h4>
                                            <p className="mt-2 text-gray-600 dark:text-gray-400">You can now use multiple prompts by separating them with commas, and each prompt should be enclosed in quotation marks, like this: "Prompt1", "Prompt2".</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-100">Enter the Number of Images</h4>
                                            <p className="mt-2 text-gray-600 dark:text-gray-400">Use the slider to specify the quantity of images you want to generate for each prompt.</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-100">Customize the advance details according to yor requiments</h4>
                                            <p className="mt-2 text-gray-600 dark:text-gray-400">Use the seed, prompt strength, generation step for each prompt.</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-100">Submit the Prompt</h4>
                                            <p className="mt-2 text-gray-600 dark:text-gray-400">Click the Generate Images button to submit your prompt (ensure your credits are ready).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div aria-hidden="true" className="mt-10 lg:mt-0">
                                <img src="images/step1.png" alt="Step 1 Screenshot" className="mx-auto rounded-2xl shadow-md bg-gray-100 border" />
                            </div>
                        </div>
                        <div>
                            <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
                                <div className="lg:col-start-2">
                                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-800 dark:text-gray-100">Get Your Images</h3>
                                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Once you've submitted your prompts, our AI model will generate the images according to your specifications.</p>
                                    <div className="mt-12 space-y-12">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-100">Download Your Images</h4>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">Once generated, you can download the images for use in your projects, presentations, or creative endeavors.</p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-100">Explore More Options</h4>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">Discover advanced settings and options to customize the generated images further to suit your needs.</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-medium leading-6 text-gray-800 dark:text-gray-100">Feedback and Improvement</h4>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">Provide feedback to help us improve Genie Genesis and enhance your experience with our generative AI model.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1">
                                    <img src="images/images1.png" alt="Generated Images" className="mx-auto my-2 rounded-lg shadow-2xl bg-gray-500 border " />
                                    <img src="images/images2.png" alt="Generated Images" className="mx-auto my-2 rounded-lg shadow-2xl bg-gray-500 border " />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default Steps;
