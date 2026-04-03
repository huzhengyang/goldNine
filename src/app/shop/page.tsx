import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-bg-secondary">
      <Navbar />

      <div className="pt-[80px] pb-[80px] md:pb-0 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              商城系统开发中
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              我们正在为您准备专业的台球装备商城，敬请期待！
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl mb-3">🎱</div>
                <h3 className="font-semibold text-gray-900 mb-2">专业球杆</h3>
                <p className="text-sm text-gray-600">精选品牌球杆</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl mb-3">👕</div>
                <h3 className="font-semibold text-gray-900 mb-2">运动装备</h3>
                <p className="text-sm text-gray-600">专业运动服饰</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">训练器材</h3>
                <p className="text-sm text-gray-600">辅助训练设备</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                返回首页
              </Link>
              <Link
                href="/venues"
                className="bg-white text-primary border border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                浏览球房
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] flex items-center justify-around px-2">
        <MobileNavItem icon="🏠" label="首页" href="/" />
        <MobileNavItem icon="📰" label="新闻" href="/news" />
        <MobileNavItem icon="🎯" label="AI分析" href="/analysis" />
        <MobileNavItem icon="🏢" label="球房" href="/venues" />
        <MobileNavItem icon="👤" label="我的" href="/profile" />
      </nav>
    </main>
  );
}

function MobileNavItem({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center py-1 text-gray-600 hover:text-primary transition-colors"
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </Link>
  );
}
