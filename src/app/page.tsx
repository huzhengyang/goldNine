import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Newspaper,
  Trophy,
  Brain,
  Building2,
  GraduationCap,
  ShoppingBag,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-secondary">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-[60px]">
        <div className="relative h-[300px] md:h-[400px] bg-gradient-dark overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              🎱 AI动作分析，让训练更智能
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              上传打球视频，30秒获得专业训练报告
            </p>
            <div className="flex gap-4">
              <Link
                href="/ai-analysis"
                className="bg-gradient-gold px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-shadow"
              >
                立即体验
              </Link>
              <Link
                href="/news"
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 功能导航 */}
      <section className="py-8 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <FeatureCard
              icon={<Newspaper className="w-6 h-6" />}
              title="新闻资讯"
              description="热门台球新闻"
              href="/news"
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI动作分析"
              description="智能训练助手"
              href="/ai-analysis"
              color="bg-purple-50 text-purple-600"
            />
            <FeatureCard
              icon={<Building2 className="w-6 h-6" />}
              title="球房预订"
              description="附近优质球房"
              href="/venues"
              color="bg-green-50 text-green-600"
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6" />}
              title="赛事报名"
              description="精彩赛事等你"
              href="/events"
              color="bg-orange-50 text-orange-600"
            />
            <FeatureCard
              icon={<GraduationCap className="w-6 h-6" />}
              title="助教预约"
              description="专业教练指导"
              href="/coaches"
              color="bg-pink-50 text-pink-600"
            />
            <FeatureCard
              icon={<ShoppingBag className="w-6 h-6" />}
              title="商城购物"
              description="专业台球装备"
              href="/shop"
              color="bg-indigo-50 text-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* 热门新闻 */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">热门新闻</h2>
            <Link href="/news" className="text-primary hover:text-primary-dark text-sm font-medium">
              查看更多 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-[180px] bg-gradient-to-r from-gray-200 to-gray-300" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    热门新闻标题 {i}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    这是新闻摘要内容，展示主要信息...
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>3小时前</span>
                    <span>浏览 1.2k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部信息 */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-2xl">🎱</span>
            <span className="ml-2 font-bold text-lg">GoldNine 台球门户</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 GoldNine.cn 版权所有
          </p>
        </div>
      </footer>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] flex items-center justify-around px-2">
        <MobileNavItem icon="🏠" label="首页" href="/" />
        <MobileNavItem icon="📰" label="新闻" href="/news" />
        <MobileNavItem icon="🎯" label="AI分析" href="/ai-analysis" />
        <MobileNavItem icon="🏢" label="球房" href="/venues" />
        <MobileNavItem icon="👤" label="我的" href="/profile" />
      </nav>
    </main>
  );
}

// 功能卡片组件
function FeatureCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-shadow group"
    >
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
    </Link>
  );
}

// 移动端导航项组件
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
