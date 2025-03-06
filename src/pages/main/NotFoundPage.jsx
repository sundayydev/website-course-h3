import React from "react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="text-center animate-bounce">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>
                <p className="text-2xl text-gray-600 mt-4">
                    Trang bạn đang tìm kiếm không tồn tại.
                </p>
                <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Quay lại trang chủ
                </a>
            </div>
        </div>
    );
};

export default NotFound;