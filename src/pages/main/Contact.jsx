import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
const Contact = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl w-full px-6">
        {/* Tiêu đề */}
        <h2 className="text-4xl text-center text-pink-600 dark:text-pink-400 font-bold mb-4">
          Liên hệ với chúng tôi
        </h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-10">
          Bạn có thắc mắc? Liên hệ với chúng tôi và chúng tôi sẽ sớm liên hệ lại với bạn.
        </p>

        {/* Thông tin liên hệ */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
            Thông tin liên lạc
          </h3>
          <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FaMapMarkerAlt className="text-pink-600 dark:text-pink-400" />
            Địa chỉ: 123 Flower Street, Bloom City, Hoa Kỳ
          </p>
          <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FaPhoneAlt className="text-pink-600 dark:text-pink-400" />
            Điện thoại: +1 234 567 890
          </p>
          <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FaEnvelope className="text-pink-600 dark:text-pink-400" />
            Email: support@petalhaven.com
          </p>
        </div>

        {/* Form liên hệ */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
            Gửi tin nhắn cho chúng tôi
          </h3>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">Name</label>
              <input
                type="text"
                className="w-full p-3 mt-1 border border-pink-400 focus:outline-none rounded-lg focus:ring-2 focus:ring-pink-400 dark:text-white"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">Email</label>
              <input
                type="email"
                className="w-full p-3 mt-1 border border-pink-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:text-white"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Thông điệp
              </label>
              <textarea
                className="w-full p-3 mt-1 border border-pink-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-900 dark:text-white"
                rows="5"
                placeholder="Viết tin nhắn của bạn ở đây..."
              ></textarea>
            </div>

            <button className="w-full p-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300">
              Gửi tin nhắn
            </button>
          </form>
        </div>

        {/* Google Maps */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
            Ghé thăm chúng tôi
          </h3>
          <iframe
            className="w-full h-64 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15674.479932513508!2d106.7588497!3d10.84036615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752719273d6265%3A0xf0b3de0c32127b5f!2zV2luLkQgR2FtaW5nICYgQmlsbGlhcmRzIFRo4bunIMSQ4bupYw!5e0!3m2!1svi!2s!4v1740501966458!5m2!1svi!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
