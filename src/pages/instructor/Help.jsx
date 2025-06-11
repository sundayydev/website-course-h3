import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const helpTopics = [
    {
      title: "Quản lý khóa học",
      items: [
        {
          question: "Làm thế nào để tạo một khóa học mới?",
          answer: "Để tạo khóa học mới, hãy vào mục 'Khóa học' và nhấn nút 'Tạo khóa học mới'. Điền đầy đủ thông tin về khóa học bao gồm tên, mô tả, giá và nội dung khóa học."
        },
        {
          question: "Cách chỉnh sửa khóa học đã tạo?",
          answer: "Vào mục 'Khóa học', tìm khóa học cần chỉnh sửa và nhấn vào nút 'Chỉnh sửa'. Bạn có thể cập nhật thông tin, thêm hoặc xóa bài học, và thay đổi cài đặt khóa học."
        }
      ]
    },
    {
      title: "Quản lý bài học",
      items: [
        {
          question: "Làm thế nào để thêm bài học mới?",
          answer: "Trong trang chỉnh sửa khóa học, nhấn vào nút 'Thêm bài học'. Bạn có thể tải lên video, tài liệu và thêm mô tả cho bài học."
        },
        {
          question: "Cách sắp xếp thứ tự các bài học?",
          answer: "Sử dụng tính năng kéo thả trong phần quản lý bài học để sắp xếp lại thứ tự các bài học theo ý muốn."
        }
      ]
    },
    {
      title: "Quản lý học viên",
      items: [
        {
          question: "Làm thế nào để xem danh sách học viên?",
          answer: "Vào mục 'Học viên' trong dashboard để xem danh sách học viên đã đăng ký khóa học của bạn."
        },
        {
          question: "Cách theo dõi tiến độ học tập của học viên?",
          answer: "Trong phần quản lý học viên, bạn có thể xem thống kê về tiến độ học tập, thời gian học và kết quả bài tập của từng học viên."
        }
      ]
    },
    {
      title: "Thanh toán và doanh thu",
      items: [
        {
          question: "Làm thế nào để xem báo cáo doanh thu?",
          answer: "Vào mục 'Báo cáo' trong dashboard để xem thống kê doanh thu theo ngày, tháng hoặc năm."
        },
        {
          question: "Cách rút tiền từ tài khoản?",
          answer: "Vào mục 'Tài chính', chọn 'Rút tiền' và làm theo hướng dẫn để rút tiền về tài khoản ngân hàng của bạn."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Trung tâm Trợ giúp</h1>
      
      <div className="grid gap-6">
        {helpTopics.map((topic, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {topic.items.map((item, itemIndex) => (
                  <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Liên hệ hỗ trợ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Nếu bạn không tìm thấy câu trả lời cho vấn đề của mình, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi:
            </p>
            <ul className="list-disc pl-6">
              <li>Email: support@example.com</li>
              <li>Hotline: 1900-xxxx</li>
              <li>Thời gian làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 6)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help; 