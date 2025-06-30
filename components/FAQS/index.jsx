export default () => {

    const faqsList = [
        {
            q: "What is Genie Genesis?",
            a: "Genie Genesis is a state-of-the-art text-to-image generation platform that allows users to create high-quality images from text prompts using advanced generative AI models."
        },
        {
            q: "How do I get started with Genie Genesis?",
            a: "Getting started is easy! Simply create an account, and you'll receive 20 free credits to generate images. Each credit allows you to create 4 images."
        },
        {
            q: "How can I purchase additional credits?",
            a: "You can purchase additional credits directly from your account dashboard. Each credit costs $1 and allows you to generate 4 images."
        },
        {
            q: "Is there a limit to the number of images I can generate?",
            a: "There is no limit to the number of images you can generate as long as you have sufficient credits in your account."
        },
        {
            q: "What kind of images can I create with Genie Genesis?",
            a: "You can create a wide range of images, from artistic illustrations to realistic photographs, based on the text prompts you provide."
        },
        {
            q: "How secure is my data with Genie Genesis?",
            a: "We prioritize your data security and privacy. All your data is securely stored and processed in compliance with industry-standard security protocols."
        },
    ];

    return (
        <section className="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8" id="FAQ">
            <div className="space-y-3 text-center">
                <h1 className="text-3xl text-gray-100 font-semibold">
                    Frequently Asked Questions
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto text-lg">
                    Have questions about Genie Genesis? Here are some of the most frequently asked questions. If you still need help, feel free to contact us.
                </p>
            </div>
            <div className="mt-14 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                {
                    faqsList.map((item, idx) => (
                        <div
                            className="space-y-3 mt-5"
                            key={idx}
                        >
                            <h4 className="text-xl text-gray-300 font-medium">
                                {item.q}
                            </h4>
                            <p className="text-gray-500">
                                {item.a}
                            </p>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};
