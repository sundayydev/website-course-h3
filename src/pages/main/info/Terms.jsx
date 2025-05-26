import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 text-gray-800 mt-16">
      <header className="bg-emerald-700 text-white p-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Điều Khoản và Điều Kiện</h1>
          <p className="mt-2 text-sm">Cập nhật lần cuối: 25/05/2025</p>
        </div>
      </header>

      <main className="container mx-auto p-6 py-10">
        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">1. Giới thiệu</h2>
          <p className="text-gray-600 leading-relaxed">
            Chào mừng bạn đến với nền tảng học tập trực tuyến của chúng tôi. Các điều khoản và điều kiện này ("Điều khoản") điều chỉnh việc sử dụng các khóa học, nội dung, và dịch vụ được cung cấp bởi H3 Education. Bằng cách truy cập hoặc sử dụng nền tảng của chúng tôi, bạn đồng ý tuân thủ các điều khoản này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">2. Chấp nhận Điều khoản</h2>
          <p className="text-gray-600 leading-relaxed">
            Việc đăng ký hoặc truy cập vào bất kỳ khóa học nào trên nền tảng này đồng nghĩa với việc bạn đã đọc, hiểu, và đồng ý với các điều khoản này, cũng như các chính sách liên quan như Chính sách Bảo mật. Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào, và các thay đổi sẽ có hiệu lực ngay sau khi được đăng tải.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">3. Quyền sở hữu trí tuệ</h2>
          <p className="text-gray-600 leading-relaxed">
            Tất cả nội dung khóa học, bao gồm video, tài liệu, bài kiểm tra, và tài nguyên khác, là tài sản trí tuệ của H3 Education hoặc các đối tác được cấp phép. Bạn được cấp phép sử dụng nội dung này chỉ cho mục đích học tập cá nhân. Sao chép, phân phối, hoặc sử dụng thương mại mà không có sự cho phép bằng văn bản là vi phạm pháp luật.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">4. Thanh toán và Hủy đăng ký</h2>
          <p className="text-gray-600 leading-relaxed">
            Các khoản thanh toán cho khóa học là không hoàn tiền trừ khi có chính sách hoàn tiền cụ thể được nêu trong mô tả khóa học. Bạn có thể hủy đăng ký bất cứ lúc nào, nhưng quyền truy cập vào nội dung có thể bị chấm dứt sau khi hủy. Tất cả giao dịch được xử lý qua các kênh thanh toán an toàn.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">5. Hành vi Người dùng</h2>
          <p className="text-gray-600 leading-relaxed">
            Bạn đồng ý không sử dụng nền tảng này để thực hiện các hành vi bất hợp pháp, phân biệt đối xử, hoặc gây rối. Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu phát hiện vi phạm.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">6. Giới hạn Trách nhiệm</h2>
          <p className="text-gray-600 leading-relaxed">
            H3 Education không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi. Nội dung khóa học được cung cấp "như hiện tại" mà không có bất kỳ bảo đảm nào.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">7. Liên hệ</h2>
          <p className="text-gray-600 leading-relaxed">
            Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@company.com" className="text-emerald-600 hover:underline">support@company.com</a> hoặc số điện thoại: +84 123 456 789.
          </p>
        </section>
      </main>

      <footer className="bg-emerald-700 text-white p-6 text-center">
        <p className="text-sm">&copy; 2025 H3 Education. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default Terms;