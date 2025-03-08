import React from 'react';

const PriceInfo = ({ oldPrice, newPrice }) => (
    <div className="mb-2">
        <p className="line-through text-gray-500 text-sm">{oldPrice}</p>
        <p className="text-red-500 font-bold text-lg">{newPrice}</p>
    </div>
);

const TeacherInfo = ({ teacher, students, duration }) => (
    <div className="flex items-center space-x-4">
        <div className="flex items-center">
            <img src={teacher.avatar} alt={teacher.name} className="w-8 h-8 rounded-full" />
            <span className="ml-2 text-sm">{teacher.name}</span>
        </div>
        <div className="flex space-x-2 text-sm">
            <span>👥 {students}</span>
            <span>⏳ {duration}</span>
        </div>
    </div>
);

const CourseCard = ({ title, description, oldPrice, newPrice, teacher, students, duration, bgColor }) => {
    return (
        <div className={`rounded-2xl shadow-lg overflow-hidden ${bgColor} text-white w-full md:w-1/3 lg:w-1/4 transform transition-transform duration-300 hover:scale-105 flex flex-col`}>
            <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                    {title}
                </h2>
                <p className="text-sm mb-4  ">{description}</p>
            </div>
            <div className="bg-white text-black p-4">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <PriceInfo oldPrice={oldPrice} newPrice={newPrice} />
                <TeacherInfo teacher={teacher} students={students} duration={duration} />
            </div>
        </div>
    );
};

const FreeCourseCard = ({ title, subtitle, description, newPrice, participants, lessons, duration, bgColor }) => {
    return (
        <div className={`rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r from-purple-400 to-pink-500 text-white w-full md:w-1/3 lg:w-1/4 transform transition-transform duration-300 hover:scale-105 flex flex-col`}>
            <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-sm mb-4">{subtitle}</p>
            </div>
            <div className="bg-white text-black p-4">
                <h3 className="text-lg font-semibold mb-2">{description}</h3>
                <PriceInfo newPrice={newPrice} />
                <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">👥 {participants}</span>
                    <span className="mr-4">📚 {lessons}</span>
                    <span>⏳ {duration}</span>
                </div>
            </div>
        </div>
    );
};

const PostCard = ({ title, author, readTime, image }) => {
    return (
        <div className="rounded-2xl shadow-lg overflow-hidden w-full md:w-1/3 lg:w-1/4 transform transition-transform duration-300 hover:scale-105 flex flex-col">
            <div className="w-full h-40 flex-shrink-0">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="bg-white text-black p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{author} · {readTime} đọc</p>
            </div>
        </div>
    );
};

const CourseList = () => {
    const courses = [
        {
            title: 'Bắt đầu với crush',
            description: 'Cho lốp trưởng',
            oldPrice: '2.500.000đ',
            newPrice: '1.299.000đ',
            teacher: { name: 'Duy Hoàng', avatar: 'https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/479491636_2070931380019709_4931643581541913286_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEqIv7uNt2RhKriyZ00JdQIkC8weaQtVM-QLzB5pC1Uz9gHta1q5ZbholvLg__UZHMrgR8UKN2xHSi2hQLvSzKP&_nc_ohc=3BpEE2O5yrgQ7kNvgExejZP&_nc_oc=AdhMhKbAA94_0XssyjriRk6bUrRr4__gdmWjWHTZJcWOEShJUy09NcfV6Z6kYReCl00&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=Ai9it-D_-rJZJNh8A3cCFke&oh=00_AYB33yjIuigQ4CQEEyppoAJ7IMI6zm6qbMdGgSlI_qvHrA&oe=67C4B0B6' },
            students: 591,
            duration: '10p',
            bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        },
        {
            title: 'Lốp trưởng Pro',
            description: 'Cho người lốp trưởng lâu năm',
            oldPrice: '3.299.000đ',
            newPrice: '1.399.000đ',
            teacher: { name: 'Mạnh Hùng', avatar: 'https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-1/476545352_2360488530995041_83206760389699713_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHb3OwIcUa3gbV6N4Mz5LH45_mEmropIXjn-YSauikheI7NRnRWOjpHEbUMa_fBvjImPSNwOPlMi_C2xkuQEwp9&_nc_ohc=7s7XJFcnIecQ7kNvgHwX93L&_nc_oc=AdgFZlOFROcccTcK98cHfOFVQgiTs10GnBObL8rsom_-q_PPbjAg0CLDMsBaTOqeKNo&_nc_zt=24&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=AMEHkj10Kw6JPjpoUTf_Nug&oh=00_AYDy3mfvEwG_HMLD53wOYLACotdDIROxlVa-gBCDL24uVg&oe=67C484E1' },
            students: 187,
            duration: '50p',
            bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500'
        },
        {
            title: 'Dỗ dành người yêu',
            description: 'Cho người có người yêu',
            oldPrice: '400.000đ',
            newPrice: '299.000đ',
            teacher: { name: 'Huân Lê', avatar: 'https://static-images.vnncdn.net/files/publish/2022/9/3/bien-vo-cuc-thai-binh-346.jpeg' },
            students: 27,
            duration: '5p',
            bgColor: 'bg-gradient-to-r from-pink-400 to-pink-600'
        }
    ];

    const freeCourses = [
        {
            title: 'Kiến Thức Nền Tảng',
            subtitle: 'Kiến thức nhập môn{}',
            description: 'Kiến Thức Nhập Môn IT',
            newPrice: 'Miễn Phí',
            participants: 133217,
            lessons: 9,
            duration: '3h12p',
            bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
        }
    ];

    const posts = [
        {
            title: 'Tổng hợp các sản phẩm của học viên tại F8',
            author: 'Sơn Đặng',
            readTime: '6 phút',
            image: 'https://sineksekiz.com/wp-content/uploads/2025/02/anh-gai-xinh-0l76Qlt.jpg'
        },
        {
            title: 'Cách đưa code lên GitHub và tạo GitHub Pages',
            author: 'Vo Minh Kha',
            readTime: '4 phút',
            image: 'https://live.staticflickr.com/65535/51988206348_e72992b30c_k.jpg'
        }
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-left">Khóa học Pro</h1>
            </div>
            <div className="flex flex-wrap justify-start gap-4">
                {courses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                ))}
            </div>
            <div className="text-left mt-8 text-gray-600">
                432.776+ người khác đã học
            </div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Khóa học Miễn phí</h1>
                <a href="#" className="text-red-500 text-sm cursor-pointer">
                    Xem lộ trình &gt;
                </a>
            </div>
            <div className="flex flex-wrap justify-start gap-4">
                {freeCourses.map((course, index) => (
                    <FreeCourseCard key={index} {...course} />
                ))}
            </div>
            <div className="flex justify-between items-center mb-8 mt-8">
                <h1 className="text-3xl font-bold">Bài viết nổi bật</h1>
                <a href="#" className="text-red-500 text-sm cursor-pointer">
                    Xem lộ trình &gt;
                </a>
            </div>
            <div className="flex flex-wrap justify-start gap-4">
                {posts.map((post, index) => (
                    <PostCard key={index} {...post} />
                ))}
            </div>
        </div>
    );
};

export default CourseList;