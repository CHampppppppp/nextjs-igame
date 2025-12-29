import { ragSystem } from '../lib/ai/rag-chain';
import { v4 as uuidv4 } from 'uuid';

const labInfo = [
  {
    title: "iGame Lab 基本信息",
    content: `iGame Lab（智能可视化与仿真实验室）是杭州电子科技大学计算机学院的一个研究实验室。

实验室信息：
- 全称：Intelligent Visual Modeling & Simulation Lab
- 简称：iGame Lab
- 所属单位：杭州电子科技大学计算机学院图形图像所
- 成立时间：2010年代初
- 负责人：徐岗教授
- 实验室位置：杭州电子科技大学

团队规模：
- 教师：6名（教授1名，副教授3名，讲师2名）
- 博士研究生：3名
- 硕士研究生：40多名

研究方向：
1. 计算机辅助设计与仿真
2. 等几何分析
3. 计算机视觉
4. 机器学习

主要成果：
- 在CMAME、CAD、CAGD、Computers & Structures、IEEE TCYB、IEEE TIP等国际权威SCI期刊发表论文30余篇
- 多篇论文入选ESI热点论文和高被引论文
- 主持承担多项国家自然科学基金项目
- 与国内外知名学者保持广泛学术交流与合作`
  },
  {
    title: "团队成员信息",
    content: `实验室核心团队成员：

教师团队：
1. 徐岗（Xu Gang）- 教授、实验室负责人
   - 研究方向：计算机辅助几何设计、等几何分析
   - 主要成就：主持国家自然科学基金项目，在顶级期刊发表多篇论文

2. 高飞（Gao Fei）- 副教授
   - 研究方向：计算机视觉、机器学习、生成对抗网络
   - 主要成就：IEEE Transactions on Image Processing等期刊发表论文

3. 顾仁树（Gu Renshu）- 副教授
   - 研究方向：计算机图形学、几何建模

4. 吴海燕（Wu Haiyan）- 副教授
   - 研究方向：计算机视觉、图像处理

研究生团队：
- 博士研究生：3名
- 硕士研究生：40多名
- 本科实习生：多名

团队特点：
- 注重理论与实践结合
- 鼓励创新研究
- 重视国际合作
- 培养全面发展的人才`
  },
  {
    title: "研究成果和论文",
    content: `实验室主要研究成果：

代表性论文：
1. "Singularity structure simplification of hexahedral mesh via weighted ranking"
   - 作者：Gang Xu*, Ran Ling, Yongjie Jessica Zhang, Zhoufang Xiao, Zhongping Ji, Timon Rabczuk
   - 期刊：Computer-Aided Design (CCF B)
   - 主要贡献：六面体网格奇异结构简化算法

2. "IGA-suitable planar parameterization with patch structure simplification of closed-form polysquare"
   - 作者：S Wang, J Ren, X Fang, H Lin, G Xu, H Bao, J Huang
   - 期刊：Computer Methods in Applied Mechanics and Engineering (TOP期刊)
   - 主要贡献：等几何分析的平面参数化方法

3. "Complementary, Heterogeneous and Adversarial Networks for Image-to-Image Translation"
   - 作者：Fei Gao, Xingxin Xu, Jun Yu, Meimei Shang, Xiang Li, and Dacheng Tao
   - 期刊：IEEE Transactions on Image Processing (TOP期刊)
   - 主要贡献：图像到图像转换的深度学习方法

科研项目：
- 国家自然科学基金面上项目（已获批）
- 中德合作重点项目（已完成）
- 企业合作项目（多个）

学术交流：
- 与卡尔斯鲁厄理工学院（KIT）合作
- 与浙江大学、清华大学等国内高校合作
- 参加国际学术会议并做邀请报告`
  },
  {
    title: "联系方式和招募信息",
    content: `联系方式：
- 实验室网站：igame-lab.dasusm.com
- 邮箱：xugang@hdu.edu.cn（徐岗教授）
- 地址：浙江省杭州市杭州电子科技大学

招募信息：
实验室常年招募优秀人才：

研究生招募：
- 博士研究生：欢迎优秀本科毕业生申请
- 硕士研究生：计算机、数学、工程等相关专业
- 研究方向：计算机图形学、计算机视觉、机器学习、数值计算等

本科生机会：
- 科研实习：参与实验室项目研究
- 毕业设计：导师指导下的创新项目
- 推荐免试研究生：优秀本科生推荐免试攻读研究生

应聘条件：
- 对科研有浓厚兴趣
- 具备扎实的数学和编程基础
- 良好的学习能力和团队合作精神
- 英语水平良好（阅读写作）

加入方式：
- 研究生：通过杭州电子科技大学研究生招生网申请
- 本科实习：发送简历至实验室邮箱
- 企业合作：欢迎技术合作和项目合作`
  }
];

async function initMemories() {
  console.log('开始初始化实验室记忆文档...');

  try {
    for (const info of labInfo) {
      const documentId = uuidv4();
      const memoryDoc = {
        id: documentId,
        content: info.content,
        metadata: {
          title: info.title,
          type: 'text/plain',
          createdAt: new Date().toISOString(),
          category: 'lab_info'
        }
      };

      await ragSystem.addDocument(memoryDoc);
      console.log(`已添加文档: ${info.title}`);
    }

    console.log('实验室记忆文档初始化完成！');
  } catch (error) {
    console.error('初始化记忆文档失败:', error);
  }
}

// 运行初始化
initMemories();
