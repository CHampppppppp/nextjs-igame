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

// 活动卡片组件
function ActivityCard({ activity }: { activity: typeof activities[0] }) {
  return (
    <div className="content-block overflow-hidden rounded-xl">
      <div className="aspect-video relative rounded-md overflow-hidden">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-primary-charcoal">{activity.title}</h3>
          <span className="text-sm text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full">
            {activity.date}
          </span>
        </div>
        <p className="text-text-muted">{activity.description}</p>
      </div>
    </div>
  );
}

// 统计数据
const stats = [
  { label: "学术报告", value: "24场", icon: "🎤" },
  { label: "团队活动", value: "15次", icon: "🎉" },
  { label: "成员参与", value: "67人", icon: "👥" },
  { label: "活动覆盖", value: "100%", icon: "📊" }
];

// 统计卡片组件
function StatCard({ stat }: { stat: typeof stats[0] }) {
  return (
    <div className="content-block p-6 text-center rounded-lg">
      <div className="text-3xl mb-3">{stat.icon}</div>
      <div className="text-2xl font-semibold text-primary-charcoal mb-1">{stat.value}</div>
      <div className="text-text-muted">{stat.label}</div>
    </div>
  );
}

export default function TeamBuildingPage() {
  return (
    <div className="min-h-screen bg-warm">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-primary-charcoal mb-4 elegant-heading">团队建设</h1>
          <p className="text-lg elegant-subheading max-w-3xl mx-auto">
            除了学术研究，我们重视团队建设和文化建设，通过各类活动增进成员之间的交流与合作。
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 活动统计 */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="elegant-heading text-3xl mb-4">活动概况</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </section>

        {/* 活动图片展示 */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="elegant-heading text-3xl mb-4">活动掠影</h2>
            <p className="elegant-subheading">记录实验室精彩的团队活动瞬间</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </div>
        </section>

        {/* 活动理念 */}
        <section className="content-block rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="elegant-heading text-3xl mb-4">活动理念</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-charcoal mb-2">增进交流</h3>
              <p className="text-text-muted">通过各类活动促进成员之间的交流，增进感情</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-charcoal mb-2">明确目标</h3>
              <p className="text-text-muted">明确团队发展目标，统一发展方向</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-charcoal mb-2">激发活力</h3>
              <p className="text-text-muted">激发团队活力，提升工作效率和创新能力</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
