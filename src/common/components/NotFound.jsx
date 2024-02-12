import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <body class="flex flex-col h-screen justify-center items-center bg-gray-100">
            <div class="flex flex-col items-center">
                <h1 class="text-[120px] font-extrabold text-gray-700">404</h1>
                <p class="text-2xl font-medium text-gray-600 mb-6">Page Not Found</p>
                <Link to="/main"
                    class="px-4 py-2 font-medium text-white bg-green-400 rounded-md hover:bg-green-300 transition-all duration-200 ease-in-out">
                    Go Home
                </Link>
            </div>
        </body>
    );
}

export default NotFound;