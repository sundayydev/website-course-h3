import React from 'react';

const articles = [
  {
    id: 1,
    author: 'Sơn Đặng',
    title: "Hoàng Bảo Trung - Học viên tiêu biểu của F8 tỏa sáng với dự án 'AI Powered Learning'",
    description:
      'Trong thời đại công nghệ số 4.0, việc học không còn bó buộc trong những cuốn sách truyền thống. Giờ đây, trí tuệ nhân tạo (AI) đang...',
    tag: 'ReactJS',
    time: '5 tháng trước',
    readTime: '6 phút đọc',
    image:
      'https://th.bing.com/th/id/OIP.hGWmKPOXb_FWycxHW_0uYQHaHa?pid=ImgDet&w=206&h=206&c=7&dpr=1.1',
  },
  {
    id: 2,
    author: 'Lý Cao Nguyên',
    title: 'Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày',
    description:
      'Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...',
    tag: 'Front-end',
    time: '8 tháng trước',
    readTime: '4 phút đọc',
    image:
      'https://th.bing.com/th/id/OIP.KpVV5lNASX22ThNs2pCSPgHaHa?pid=ImgDet&w=206&h=206&c=7&dpr=1.1',
  },
  {
    id: 2,
    author: 'Lý Cao Nguyên',
    title: 'Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày',
    description:
      'Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...',
    tag: 'Front-end',
    time: '8 tháng trước',
    readTime: '4 phút đọc',
    image:
      'https://th.bing.com/th/id/OIP.EfxjdRdhh_nXn8DshGVxPgHaIf?pid=ImgDet&w=206&h=236&c=7&dpr=1.1',
  },
  {
    id: 3,
    author: 'Lý Cao Nguyên',
    title: 'Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày',
    description:
      'Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...',
    tag: 'Front-end',
    time: '8 tháng trước',
    readTime: '4 phút đọc',
    image:
      'https://th.bing.com/th/id/OIP.Z48-WiIgc_bMyX70yxwfqQHaIZ?pid=ImgDet&w=206&h=233&c=7&dpr=1.1',
  },
  {
    id: 4,
    author: 'Lý Cao Nguyên',
    title: 'Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày',
    description:
      'Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết. Bài viết này...',
    tag: 'Front-end',
    time: '8 tháng trước',
    readTime: '4 phút đọc',
    image:
      'https://th.bing.com/th/id/OIP.F1gE3eseTe_AlTeWnMEzrwHaHa?pid=ImgDet&w=206&h=206&c=7&dpr=1.1',
  },
];

const topics = ['Front-end / Mobile apps', 'Back-end / Devops', 'UI / UX / Design', 'Others'];

const Post = () => {
  return (
    <div className="max-w-5xl mx-auto p-2">
      {/* Sidebar trên Mobile */}
      <div className="md:hidden mb-4">
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h4 className="font-semibold mb-4">XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ</h4>
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                className="block px-4 py-2 bg-gray-200 rounded-full text-sm w-full text-left"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Danh sách bài viết */}
        <div className="md:col-span-2 space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="p-4 border rounded-lg shadow-sm flex flex-col gap-4">
              {/* Hàng trên cùng: Ảnh đại diện + Tác giả */}
              <div className="flex items-center gap-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p className="text-sm font-semibold text-gray-700">{article.author}</p>
              </div>
              <hr />
              {/* Nội dung bài viết */}
              <div className="flex gap-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-32 h-25 object-cover rounded-lg hidden md:block"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium">
                      {article.tag}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{article.time}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Desktop */}
        <div className="hidden md:block sticky top-0">
          <h4 className="font-semibold mb-4">XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ</h4>
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                className="block px-4 py-2 bg-gray-200 rounded-full text-sm w-full text-left"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Quảng cáo khóa học */}
          <div className="mt-6 bg-purple-600 text-white p-4 rounded-lg text-center">
            <h4 className="font-bold text-lg">Khóa học HTML CSS PRO</h4>
            <ul className="text-sm text-left space-y-1 mt-2">
              <li>✔ Thực hành 8 dự án</li>
              <li>✔ Hơn 300 bài tập thử thách</li>
              <li>✔ Tặng ứng dụng Flashcards</li>
              <li>✔ Tặng 3 Games luyện HTML CSS</li>
              <li>✔ Tặng 20+ thiết kế trên Figma</li>
            </ul>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full font-semibold">
              Tìm hiểu thêm →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
