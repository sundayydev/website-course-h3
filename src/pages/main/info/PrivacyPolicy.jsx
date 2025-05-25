import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 text-gray-800 mt-16">
      <header className="bg-emerald-700 text-white p-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Chính Sách Bảo Mật</h1>
          <p className="mt-2 text-sm">Cập nhật lần cuối: 25/05/2025, 01:38 PM +07</p>
        </div>
      </header>

      <main className="container mx-auto p-6 py-10">
        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">1. Giới thiệu</h2>
          <p className="text-gray-600 leading-relaxed">
            Chính sách Bảo mật này giải thích cách H3 Education thu thập, sử dụng, tiết lộ, và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng nền tảng học tập trực tuyến của chúng tôi. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và tuân thủ các quy định pháp luật hiện hành.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">2. Thu thập Thông tin</h2>
          <p className="text-gray-600 leading-relaxed">
            Chúng tôi thu thập các loại thông tin sau:
            <ul className="list-disc list-inside mt-2">
              <li>Thông tin cá nhân (tên, email, số điện thoại) khi bạn đăng ký khóa học.</li>
              <li>Dữ liệu sử dụng (thời gian học, tiến độ bài học) để cải thiện trải nghiệm.</li>
              <li>Cookies và dữ liệu kỹ thuật để tối ưu hóa nền tảng.</li>
            </ul>
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">3. Sử dụng Thông tin</h2>
          <p className="text-gray-600 leading-relaxed">
            Thông tin của bạn được sử dụng cho các mục đích sau:
            <ul className="list-disc list-inside mt-2">
              <li>Cung cấp và quản lý khóa học của bạn.</li>
              <li>Gửi thông báo hoặc cập nhật về khóa học.</li>
              <li>Phân tích và cải thiện dịch vụ của chúng tôi.</li>
            </ul>
            Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">4. Bảo mật Dữ liệu</h2>
          <p className="text-gray-600 leading-relaxed">
            Chúng tôi áp dụng các biện pháp bảo mật như mã hóa và lưu trữ an toàn để bảo vệ thông tin của bạn. Tuy nhiên, không có phương thức nào là hoàn toàn không thể xâm phạm, và chúng tôi không chịu trách nhiệm cho các vi phạm ngoài tầm kiểm soát.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">5. Quyền của Bạn</h2>
          <p className="text-gray-600 leading-relaxed">
            Bạn có quyền:
            <ul className="list-disc list-inside mt-2">
              <li>Yêu cầu truy cập, sửa đổi, hoặc xóa thông tin cá nhân của mình.</li>
              <li>Phản đối việc xử lý dữ liệu hoặc yêu cầu hạn chế sử dụng.</li>
              <li>Rút lại sự đồng ý bất cứ lúc nào.</li>
            </ul>
            Để thực hiện quyền của mình, vui lòng liên hệ theo thông tin dưới đây.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">6. Liên hệ</h2>
          <p className="text-gray-600 leading-relaxed">
            Nếu bạn có thắc mắc về chính sách này, vui lòng liên hệ với chúng tôi qua:
            <ul className="list-disc list-inside mt-2">
              <li>Email: <a href="mailto:privacy@company.com" className="text-emerald-600 hover:underline">privacy@company.com</a></li>
              <li>Điện thoại: +84 123 456 789</li>
            </ul>
          </p>
        </section>
      </main>

      <footer className="bg-emerald-700 text-white p-6 text-center">
        <p className="text-sm">© 2025 H3 Education. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;