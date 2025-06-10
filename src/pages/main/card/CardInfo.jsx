import { BookOpen, Monitor, UserCheck } from "lucide-react"

export default function FeatureCards() {
  const features = [
    {
      icon: BookOpen,
      title: "Chứng chỉ",
      description: "Bất cứ khi nào bạn cần mẫu HTML CSS miễn phí, bạn chỉ cần nhớ đến trang web H3.",
      link: "Đọc thêm",
    },
    {
      icon: Monitor,
      title: "Khóa học",
      description: "Bạn có thể duyệt các mẫu miễn phí dựa trên các thẻ khác nhau như tiếp thị kỹ thuật số, v.v.",
      link: "Đọc thêm",
    },
    {
      icon: UserCheck,
      title: "Chuyên gia web",
      description: "Bạn cũng có thể bắt đầu học HTML CSS bằng cách chỉnh sửa các mẫu miễn phí từ trang web của chúng tôi.",
      link: "Đọc thêm",
    },
  ]

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className=" mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-emerald-50 rounded-3xl p-8 relative min-h-[200px]">
                {/* emerald circle with icon positioned outside top-right corner */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl z-10">
                  <IconComponent className="w-12 h-12 text-white stroke-[1.5]" />
                </div>

                {/* Content aligned to the left */}
                <div className="pr-20 pt-2">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-2line-height-6">{feature.description}</p>

                  {/* Read More Link */}
                  <a
                    href="#"
                    className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors duration-200 hover:underline"
                  >
                    {feature.link}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div >
  )
}
