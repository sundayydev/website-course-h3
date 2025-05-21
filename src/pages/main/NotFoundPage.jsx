import React from 'react';

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white font-arvo">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl text-center">
            <div
              className="h-[400px] bg-no-repeat bg-center"
              style={{
                backgroundImage:
                  'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
              }}
            >
              <h1 className="text-[80px] font-bold text-emerald-500 mt-[-100px]">404</h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-[80px] font-semibold text-emerald-500">
                Look like you're lost
              </h3>
              <p className="text-lg text-gray-600 mt-4">
                The page you are looking for is not available!
              </p>
              <a
                onClick={() => window.history.back()}
                className="inline-block mt-5 px-5 py-2.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors duration-300"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;