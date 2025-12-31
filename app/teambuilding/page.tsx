import Image from "next/image";

// 活动数据
const activities = [
  {
    title: "学术报告",
    date: "2024年1月",
    description: "实验室定期学术报告会，分享最新研究进展和学术心得",
    image: "/images/resource/event-1.png"
  },
  {
    title: "年会报告",
    date: "2023年12月",
    description: "年度学术年会，总结全年研究成果，展望未来发展方向",
    image: "/images/resource/event-2.png"
  },
  {
    title: "新生聚餐",
    date: "2023年9月",
    description: "欢迎新加入实验室的同学们，增进师生情谊",
    image: "/images/resource/news-1.jpg"
  },
  {
    title: "日租房团建",
    date: "2023年11月",
    description: "团队建设活动，促进成员之间的交流与合作",
    image: "/images/resource/news-2.jpg"
  },
  {
    title: "19年会报告",
    date: "2023年10月",
    description: "实验室年度会议，汇报研究进展和未来规划",
    image: "/images/resource/news-3.jpg"
  },
  {
    title: "绍兴团建大禹陵合影",
    date: "2023年5月",
    description: "绍兴文化之旅，参观大禹陵，增进团队凝聚力",
    image: "/images/resource/news-4.jpg"
  }
];

// 统计数据
const stats = [
  { label: "学术报告", value: "24场", icon: "🎤" },
  { label: "团队活动", value: "15次", icon: "🎉" },
  { label: "成员参与", value: "67人", icon: "👥" },
  { label: "活动覆盖", value: "100%", icon: "📊" }
];

export default function TeamBuildingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">团队建设</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              除了学术研究，我们重视团队建设和文化建设，
              通过各类活动增进成员之间的交流与合作。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 活动统计 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">活动概况</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 活动图片展示 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">活动掠影</h2>
            <p className="text-lg text-gray-600">记录实验室精彩的团队活动瞬间</p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent"></div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent"></div>
            <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory py-4">
              {activities.map((activity, index) => (
                <figure
                  key={index}
                  className="snap-start shrink-0 w-[80vw] md:w-[55vw] lg:w-[40vw] relative rounded-2xl overflow-hidden"
                >
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    width={1200}
                    height={675}
                    className="w-full h-[50vh] object-cover"
                    priority={index === 0}
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-4">
                    <div className="flex justify-between items-end">
                      <h3 className="text-xl font-semibold">{activity.title}</h3>
                      <span className="text-sm">{activity.date}</span>
                    </div>
                    <p className="text-sm opacity-90 mt-1">{activity.description}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 活动理念 */}
        <section className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">活动理念</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">增进交流</h3>
              <p className="text-gray-600">通过各类活动促进成员之间的交流，增进感情</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">明确目标</h3>
              <p className="text-gray-600">明确团队发展目标，统一发展方向</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">激发活力</h3>
              <p className="text-gray-600">激发团队活力，提升工作效率和创新能力</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
