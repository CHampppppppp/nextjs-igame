import Image from "next/image";

// 研究方向数据
const researchDirections = [
  {
    title: "网格生成",
    description: "网格生成是自主可控CAD/CAE工业软件研发的重要前处理步骤。课题组基于加权排序思想，提出了六面体网格的奇异结构简化方法，对解决六面体网格生成难题提供了新途径;提出了基于边界元与标架场的高质量四边结构网格自动生成方法、基于插值体细分的高阶网格生成方法，为解决结构化网格生成的自动化难题进行了有益探索。上述系列成果均发表在 CAD、CAGD 等本领域权威期刊上，并成功应用于国防基础科研核科学挑战专题项目以及国家数值风洞重大工程，为自主可控国产工业软件的研发做出了贡献。",
    keyPapers: [
      {
        title: "Singularity structure simplification of hexahedral mesh via weighted ranking",
        authors: "Gang Xu*, Ran Ling, Yongjie Jessica Zhang, Zhoufang Xiao, Zhongping Ji, Timon Rabczuk",
        journal: "Computer-Aided Design",
        year: "2021"
      }
    ],
    image: "/images/research/mesh1.png"
  },
  {
    title: "等几何分析",
    description: "智能制造与虚拟现实是数字经济产业的重要组成部分。复杂产品的计算域高质量参数化则是困扰智能制造与虚拟现实中高精度仿真分析方法向前发展的关键瓶颈问题之一。课题组在国际上最早开始了这一问题的研究，开辟了'适合分析的计算域参数化'这一研究方向，研究了计算域参数化对等几何仿真模拟精度的影响，并定义了'适合分析的参数化'的评判度量；创新性地提出了约束优化、变分调和映射、边界重新参数化等一系列构造高质量计算域参数化的理论和方法，并解决了复杂拓扑平面区域的参数化难题, 为任意复杂计算域的参数化问题提供了基本框架, 从而为高精度仿真分析提供了重要几何基础，丰富了数字几何计算基础理论。",
    keyPapers: [
      {
        title: "IGA-suitable planar parameterization with patch structure simplification of closed-form polysquare",
        authors: "S Wang, J Ren, X Fang, H Lin, G Xu, H Bao, J Huang",
        journal: "Computer Methods in Applied Mechanics and Engineering",
        year: "2022"
      }
    ],
    image: "/images/research/geo.jpg"
  },
  {
    title: "视觉与学习",
    description: "主要研究深度学习在计算机视觉中的应用，并与计算机图形学技术相结合，涉及智能计算艺术、视频行为分析、艺术机器人等课题。课题组已在视觉质量评价与增强、图像生成与艺术风格迁移、视频人体检测与分析、虚拟试衣、绘画机器人等领域取得了丰硕成果。",
    keyPapers: [
      {
        title: "Complementary, Heterogeneous and Adversarial Networks for Image-to-Image Translation",
        authors: "Fei Gao, Xingxin Xu, Jun Yu, Meimei Shang, Xiang Li, and Dacheng Tao",
        journal: "IEEE Transactions on Image Processing",
        year: "2021"
      }
    ],
    image: "/images/research/cvdl.jpg"
  }
];

// 论文数据（模拟数据）
const recentPapers = [
  {
    title: "基于深度学习的自适应网格生成算法研究",
    authors: "徐岗, 张三, 李四",
    journal: "计算机学报",
    year: "2024",
    citations: 15
  },
  {
    title: "等几何分析在流体力学仿真中的应用",
    authors: "许金兰, 王五, 赵六",
    journal: "力学学报",
    year: "2024",
    citations: 8
  },
  {
    title: "计算机视觉辅助的三维重建技术",
    authors: "顾人舒, 钱七, 孙八",
    journal: "计算机辅助设计与图形学学报",
    year: "2023",
    citations: 22
  },
  // {
  //   title: "深度学习在工业产品检测中的应用",
  //   authors: "高飞, 周九, 吴十",
  //   journal: "模式识别与人工智能",
  //   year: "2023",
  //   citations: 12
  // }
];

// 研究项目数据
const researchProjects = [
  {
    title: "国家自然科学基金面上项目",
    description: "自适应网格生成算法研究",
    period: "2023-2026",
    funding: "60万"
  },
  {
    title: "浙江省重点研发计划",
    description: "工业软件核心技术研发",
    period: "2022-2025",
    funding: "200万"
  },
  {
    title: "企业合作项目",
    description: "三维可视化平台开发",
    period: "2023-2024",
    funding: "150万"
  }
];

// 研究方向卡片组件
function ResearchCard({ direction }: { direction: typeof researchDirections[0] }) {
  return (
    <div className="flex items-start gap-6 py-6 border-b border-gray-200">
      <Image
        src={direction.image}
        alt={direction.title}
        width={320}
        height={200}
        className="w-64 h-40 object-contain"
      />
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{direction.title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{direction.description}</p>

        {direction.keyPapers && direction.keyPapers.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">代表性论文：</h4>
            <div className="space-y-2">
              {direction.keyPapers.map((paper, index) => (
                <div key={index} className="p-2">
                  <p className="text-sm font-medium text-gray-900">{paper.title}</p>
                  <p className="text-xs text-gray-600 italic">{paper.authors}</p>
                  <p className="text-xs text-blue-600">{paper.journal} ({paper.year})</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 论文卡片组件
function PaperCard({ paper }: { paper: typeof recentPapers[0] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:bg-white hover:shadow-md transition-all">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{paper.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{paper.authors}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-blue-600">{paper.journal} ({paper.year})</span>
        <span className="text-gray-500">引用: {paper.citations}</span>
      </div>
    </div>
  );
}

// 项目卡片组件
function ProjectCard({ project }: { project: typeof researchProjects[0] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-600">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>研究周期: {project.period}</span>
        <span>资助金额: {project.funding}</span>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <i className="bi bi-search mr-3"></i>研究课题 Research Topics
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我们专注于网格生成、等几何分析、视觉与学习等前沿领域的研究，
              致力于将基础研究与工业应用相结合。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 研究课题区域 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">研究课题 Research Topics</h2>
            <br /><br />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {researchDirections.map((direction, index) => (
              <ResearchCard key={index} direction={direction} />
            ))}
          </div>
        </section>

        {/* 近期论文区域 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">近期论文</h2>
            <p className="text-lg text-gray-600">实验室成员在国内外期刊发表的最新研究成果</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPapers.map((paper, index) => (
              <PaperCard key={index} paper={paper} />
            ))}
          </div>
        </section>

        {/* 研究项目区域 */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">研究项目</h2>
            <p className="text-lg text-gray-600">实验室承担的国家和省部级科研项目</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {researchProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
