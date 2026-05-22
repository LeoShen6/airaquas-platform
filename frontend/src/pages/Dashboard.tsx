import { useEffect, useState } from 'react';
import { Users, Building2, ShoppingCart, DollarSign, TrendingUp, Activity } from 'lucide-react';

const API = 'https://airaquas-api-report.jfh-099.workers.dev';

interface DashboardData {
  total_users: number;
  total_shops: number;
  total_orders: number;
  revenue: number;
  pending_commissions: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/report/dashboard`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: '总用户数', value: data?.total_users ?? '-', icon: Users, color: 'bg-blue-500' },
    { label: '门店数', value: data?.total_shops ?? '-', icon: Building2, color: 'bg-green-500' },
    { label: '总订单', value: data?.total_orders ?? '-', icon: ShoppingCart, color: 'bg-purple-500' },
    { label: '总收入', value: data ? `¥${data.revenue.toFixed(0)}` : '-', icon: DollarSign, color: 'bg-amber-500' },
    { label: '待结算分润', value: data ? `¥${data.pending_commissions.toFixed(0)}` : '-', icon: TrendingUp, color: 'bg-red-500' },
    { label: '平台活跃度', value: '-', icon: Activity, color: 'bg-teal-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">运营仪表盘</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{card.label}</span>
                <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速入口</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'AI 诊断', path: '/diagnosis', desc: '头皮健康检测' },
            { label: '会员管理', path: '/members', desc: '会员档案查询' },
            { label: '订单管理', path: '/orders', desc: 'B2B/B2C 订单' },
            { label: '营销素材', path: '/marketing', desc: '一键分发' },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="p-4 rounded-lg bg-gray-50 hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
