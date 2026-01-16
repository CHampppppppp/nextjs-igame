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

// 将文化与申请方式转换为 RecruitmentCard 接受的结构
const cultureCardInfo = {
  title: recruitmentInfo.culture.title,
  requirements: recruitmentInfo.culture.items.map((it) => ({
    label: it.title,
    content: it.content
  }))
};

const applicationCardInfo = {
  title: "申请方式",
  requirements: [
    { label: "发送简历", content: "将简历发送至实验室邮箱" },
    { label: "联系导师", content: "直接与意向导师取得联系" },
    { label: "学校招生", content: "参加学校研究生统一招生" }
  ]
};

// 招聘卡片组件
function RecruitmentCard({ info }: { info: typeof recruitmentInfo.faculty }) {
  return (
    <div className="content-block p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-primary-charcoal mb-4">{info.title}</h2>
      <div className="space-y-4">
        {info.requirements.map((req, index) => (
          <div key={index} className="border-b border-text-muted/20 pb-4 last:border-b-0">
            <h3 className="font-medium text-primary-charcoal mb-2">{req.label}：</h3>
            <p className="text-text-muted">{req.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 培养制度卡片组件
function CultureCard({ item }: { item: typeof recruitmentInfo.culture.items[0] }) {
  return (
    <div className="content-block p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-4">{item.icon}</span>
        <h3 className="text-xl font-semibold text-primary-charcoal">{item.title}</h3>
      </div>
      <p className="text-text-muted">{item.content}</p>
    </div>
  );
}

// (ContactSidebar removed — contact info consolidated into Footer)

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-warm">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-primary-charcoal mb-4 elegant-heading">联系我们</h1>
          <p className="text-lg elegant-subheading max-w-3xl mx-auto">
            欢迎优秀的您加入iGame Lab，我们期待与您共同探索前沿技术。
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8">
          {/* 主要内容区域 */}
          <div className="space-y-8">
            {/* 招聘信息区域 */}
            <section>
              <div className="text-center mb-6">
                <h2 className="elegant-heading text-3xl mb-4">招聘信息</h2>
              </div>

              <div className="space-y-6 ">
                <RecruitmentCard info={recruitmentInfo.faculty} />
                <RecruitmentCard info={recruitmentInfo.graduate} />

                {/* 人才培养制度（使用 RecruitmentCard 形式） */}
                <RecruitmentCard info={cultureCardInfo} />
              </div>
            </section>

            {/* 申请方式（使用 RecruitmentCard 形式） */}
            <RecruitmentCard info={applicationCardInfo} />
          </div>

          {/* 侧边栏 已移除，联系信息已整合到页脚 */}
        </div>
      </div>
    </div>
  );
}
