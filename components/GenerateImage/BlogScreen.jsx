import Link from 'next/link';
import React from 'react';

const BlogScreen = () => {
  return (
    <section className="w-full max-w-10xl mb-0 h-auto py-6 sm:px-0">
      <div className="mb-8 mx-4 sm:ml-[8vw] shadow-lg p-4 sm:p-10 border rounded-2xl hover:scale-102">
        <Link
          rel="noopener noreferrer"
          href="#"
          className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-50"
        >
          <img
            src="https://autogpt.net/wp-content/uploads/2023/06/Pogla_Explore_Googles_free_generative_AI_courses_and_their_impa_7063c578-ce75-4c1b-b643-3ed100ecacd0.jpg"
            alt=""
            className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
          />
          <div className="p-6 space-y-2 lg:col-span-5">
            <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">
              Generative AI: Unleashing Creativity
            </h3>
            {/* <span className="text-xs dark:text-gray-600">July 10, 2024</span> */}
            <p>
              Advances in generative AI models like diffusion models have revolutionized content creation.
              These models produce realistic images and text that are indistinguishable from human-generated content.
              Explore the latest in AI creativity and its impact on various industries.
            </p>
          </div>
        </Link>
        <div className="grid justify-center grid-cols-1 mt-14 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sample additional posts */}
          <Link
            rel="noopener noreferrer"
            href="#"
            className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50"
          >
            <img
              role="presentation"
              className="object-cover w-full rounded h-44 dark:bg-gray-500"
              src="https://img.freepik.com/free-photo/futuristic-computer-graphic-glowing-human-face-generative-ai_188544-9003.jpg?size=626&ext=jpg&ga=GA1.1.1141335507.1719273600&semt=ais_user"
            />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
                The Future of AI Art
              </h3>
              {/* <span className="text-xs dark:text-gray-600">July 11, 2024</span> */}
              <p>
                Dive into the world of AI-generated art and discover how neural networks are reshaping
                artistic expression and creativity.
              </p>
            </div>
          </Link>
          <Link
            rel="noopener noreferrer"
            href="#"
            className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50"
          >
            <img
              role="presentation"
              className="object-cover w-full rounded h-44 dark:bg-gray-500"
              src="https://img.etimg.com/thumb/height-450,width-600,imgsize-147552,msid-98187019/.jpg"
            />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
                The Future of AI Art
              </h3>
              {/* <span className="text-xs dark:text-gray-600">July 11, 2024</span> */}
              <p>
                Dive into the world of AI-generated art and discover how neural networks are reshaping
                artistic expression and creativity.
              </p>
            </div>
          </Link>
          <Link
            rel="noopener noreferrer"
            href="#"
            className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50"
          >
            <img
              role="presentation"
              className="object-cover w-full rounded h-44 dark:bg-gray-500"
              src="https://www.digifloor.com/wp-content/uploads/2023/06/Screenshot-2024-01-18-180810.png"
            />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
                The Future of AI Art
              </h3>
              {/* <span className="text-xs dark:text-gray-600">July 11, 2024</span> */}
              <p>
                Dive into the world of AI-generated art and discover how neural networks are reshaping
                artistic expression and creativity.
              </p>
            </div>
          </Link>
          {/* Add more posts as needed */}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-50 dark:text-gray-600"
          >
            Load more posts...
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogScreen;
