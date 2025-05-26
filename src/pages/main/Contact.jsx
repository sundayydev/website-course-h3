/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { sendContactEmail } from '../../api/contactApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion'; // Thêm framer-motion cho hiệu ứng

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin!', {
        position: 'top-right',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await sendContactEmail(formData);
      toast.success(result.message || 'Gửi thành công! Chúng tôi sẽ liên hệ lại sớm.', {
        position: 'top-right',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.message || 'Không thể gửi email. Vui lòng thử lại!', {
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình hiệu ứng động
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-24 bg-gray-100 dark:bg-gray-900 font-sans">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full px-6 lg:px-12"
      >
        {/* Tiêu đề */}
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl lg:text-5xl text-center text-emerald-600 dark:text-emerald-400 font-extrabold mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-lg lg:text-xl text-center text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Bạn có thắc mắc? Gửi tin nhắn và chúng tôi sẽ phản hồi sớm nhất!
          </p>
        </motion.div>

        {/* Bố cục chính: Thông tin liên hệ và Form */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Thông tin liên hệ */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Thông tin liên lạc
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-3 text-lg">
                <FaMapMarkerAlt className="text-emerald-500 dark:text-emerald-400 text-xl" />
                <span>
                  <strong>Địa chỉ:</strong> Khu Công nghệ cao TP.HCM, Thủ Đức
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-3 text-lg">
                <FaPhoneAlt className="text-emerald-500 dark:text-emerald-400 text-xl" />
                <span>
                  <strong>Điện thoại:</strong> (028) 5445 7777
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-3 text-lg">
                <FaEnvelope className="text-emerald-500 dark:text-emerald-400 text-xl" />
                <span>
                  <strong>Email:</strong> hutech@hutech.edu.vn
                </span>
              </p>
            </div>
          </motion.div>

          {/* Form liên hệ */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Gửi tin nhắn
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Thông điệp
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300"
                  rows="5"
                  placeholder="Viết tin nhắn của bạn..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Google Maps */}
        <motion.div variants={itemVariants} className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Ghé thăm chúng tôi
          </h3>
          <iframe
            className="w-full h-80 rounded-2xl shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15674.479932513508!2d106.7588497!3d10.84036615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752719273d6265%3A0xf0b3de0c32127b5f!2zV2luLkQgR2FtaW5nICYgQmlsbGlhcmRzIFRo4bunIMSQ4bupYw!5e0!3m2!1svi!2s!4v1740501966458!5m2!1svi!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
