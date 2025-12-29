import Link from "next/link";

// 招聘信息数据
const recruitmentInfo = {
  faculty: {
    title: "诚聘教师/研究人员",
    requirements: [
      {
        label: "研究方向",
        content: "三维数字化建模、计算机视觉、工业软件开发"
      },
      {
        label: "学历要求",
        content: "博士学位"
      },
      {
        label: "学术成果",
        content: "在相关领域有较高水平的学术成果"
      },
      {
        label: "待遇福利",
        content: "参照杭州电子科技大学工作待遇执行；实验室提供必要的实验与办公条件。"
      }
    ]
  },
  graduate: {
    title: "欢迎报考硕士、博士研究生",
    requirements: [
      {
        label: "导师信息",
        content: "实验室现拥有多位硕士及博士导师，欢迎各位同学报考！"
      },
      {
        label: "报考要求",
        content: "请在邮件中附上：个人简历、教务系统成绩单、考研成绩单、研究兴趣和计划"
      },
      {
        label: "基本要求",
        content: "正直诚信，积极主动，态度良好，有很好的沟通交流能力和团队合作精神；很强的自学能力和独立思考能力，善于思考和清晰明了地表达想法；数学基础扎实，具有良好的数学思维训练和逻辑思考能力，综合能力强；编程能力强(C/C++/Python)，对编程有极大的兴趣和热情；英语基础好，具有良好的英文读写能力。"
      }
    ]
  },
  culture: {
    title: "人才培养制度",
    items: [
      {
        title: "管理制度",
        content: "严格实验室管理制度，考勤制度；每周一次学术研讨会；每周周报制度；每周一次项目小组讨论会。",
        icon: "📋"
      },
      {
        title: "培养措施",
        content: "资助每位同学在读期间至少参加一次国际/国内学术会议；依据贡献每月发放津贴，项目补助等；提供到国内外高校、科研机构的交流学习机会；每年评选科研优秀奖、科研进步奖、服务贡献奖，获奖比例50%。",
        icon: "🎓"
      }
    ]
  }
};

// 联系信息
const contactInfo = {
  address: "浙江省杭州市钱塘区下沙高教园区2号大街1158号，杭州电子科技大学",
  labAddress: "实验室：第1教研楼，北530、606室",
  officeAddress: "办公室：第1科研楼，北528室",
  contact: "徐岗 教授",
  emails: ["gxu@hdu.edu.cn", "xugangzju@gmail.com"],
  website: "http://igame.hdu.edu.cn"
};

// 招聘卡片组件
function RecruitmentCard({ info }: { info: typeof recruitmentInfo.faculty }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{info.title}</h2>
      <div className="space-y-4">
        {info.requirements.map((req, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
            <h3 className="font-semibold text-gray-900 mb-2">{req.label}：</h3>
            <p className="text-gray-600">{req.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 培养制度卡片组件
function CultureCard({ item }: { item: typeof recruitmentInfo.culture.items[0] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-4">{item.icon}</span>
        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
      </div>
      <p className="text-gray-600">{item.content}</p>
    </div>
  );
}

// 联系信息侧边栏组件
function ContactSidebar() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">联系信息</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <i className="bi bi-geo-alt-fill mr-2 text-blue-600"></i>地址：
          </h3>
          <div className="text-gray-600 space-y-1">
            <p>{contactInfo.address}</p>
            <p><i className="bi bi-building mr-1"></i>{contactInfo.labAddress}</p>
            <p><i className="bi bi-door-open-fill mr-1"></i>{contactInfo.officeAddress}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <i className="bi bi-person-circle mr-2 text-blue-600"></i>联系人：
          </h3>
          <p className="text-gray-600">{contactInfo.contact}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <i className="bi bi-envelope mr-2 text-blue-600"></i>邮箱：
          </h3>
          <div className="space-y-1">
            <p className="text-blue-600">Email1: {contactInfo.emails[0]}</p>
            <p className="text-blue-600">Email2: {contactInfo.emails[1]}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <i className="bi bi-globe mr-2 text-blue-600"></i>实验室网站：
          </h3>
          <p className="text-blue-600">{contactInfo.website}</p>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              欢迎优秀的您加入iGame Lab，我们期待与您共同探索前沿技术。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 招聘信息区域 */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">招聘信息</h2>
              </div>

              <div className="space-y-8">
                <RecruitmentCard info={recruitmentInfo.faculty} />
                <RecruitmentCard info={recruitmentInfo.graduate} />

                {/* 人才培养制度 */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="inner-title mb-6 flex items-center">
                    <i className="bi bi-people mr-3 text-blue-600 text-2xl"></i>
                    <h3 className="text-2xl font-bold text-gray-900">人才培养</h3>
                  </div>
                  <div className="text text-gray-600 space-y-4">
                    {recruitmentInfo.culture.items.map((item, index) => (
                      <div key={index} className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-2xl mr-2">{item.icon}</span>
                          {item.title}
                        </h4>
                        <ul className="space-y-2 ml-8">
                          {item.content.split('；').filter(s => s.trim()).map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <i className="bi bi-speedometer2 mr-2 mt-1 text-blue-600"></i>
                              <span>{point.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 人才培养制度区域 */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">人才培养制度</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recruitmentInfo.culture.items.map((item, index) => (
                  <CultureCard key={index} item={item} />
                ))}
              </div>
            </section>

            {/* 申请方式 */}
            <section className="bg-blue-600 text-white rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">申请方式</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📧</span>
                    </div>
                    <h3 className="font-semibold mb-2">发送简历</h3>
                    <p className="text-sm">将简历发送至实验室邮箱</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="font-semibold mb-2">联系导师</h3>
                    <p className="text-sm">直接与意向导师取得联系</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏫</span>
                    </div>
                    <h3 className="font-semibold mb-2">学校招生</h3>
                    <p className="text-sm">参加学校研究生统一招生</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg mb-6">
                    我们期待您的加入，共同创造美好的未来！
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    返回主页
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ContactSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
