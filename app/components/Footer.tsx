import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info (consolidated) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系信息</h3>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">
                <strong>地址：</strong>浙江省杭州市钱塘区下沙高教园区2号大街1158号，杭州电子科技大学
              </p>
              <p className="text-sm">
                <strong>实验室：</strong>第1教研楼，北530、606室
              </p>
              <p className="text-sm">
                <strong>办公室：</strong>第1科研楼，北528室
              </p>
              <p className="text-sm">
                <strong>联系人：</strong>徐岗 教授
              </p>
              <p className="text-sm">
                <strong>邮箱：</strong>
                <a href="mailto:gxu@hdu.edu.cn" className="ml-2 text-gray-200 hover:text-white">gxu@hdu.edu.cn</a>
              </p>
              <p className="text-sm">
                <a href="mailto:xugangzju@gmail.com" className="text-gray-200 hover:text-white">xugangzju@gmail.com</a>
              </p>
              <p className="text-sm">
                <strong>实验室网站：</strong>
                <a href="http://igame.hdu.edu.cn" target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-200 hover:text-white">igame.hdu.edu.cn</a>
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">友情链接</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">杭州电子科技大学</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">通信工程学院</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">研究生院</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">科研管理系统</a>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <h3 className="text-lg font-semibold mb-4">微信公众号</h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <Image
                src="/images/wechat.jpg"
                alt="微信公众号二维码"
                width={96}
                height={96}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 iGame Lab - 智能可视化与仿真实验室. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
