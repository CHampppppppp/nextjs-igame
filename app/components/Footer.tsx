import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <div className="space-y-2 text-gray-300">
              <p>地址：杭州市钱塘新区白杨街道2号大街</p>
              <p>杭州电子科技大学第1教研楼</p>
              <p>联系人：徐岗教授</p>
              <p>邮箱：gxu@hdu.edu.cn</p>
              <p>xugangzju@gmail.com</p>
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
