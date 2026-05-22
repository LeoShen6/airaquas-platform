import { useEffect, useState } from 'react';
import { ShoppingCart, Calendar } from 'lucide-react';

const API = 'https://airaquas-api-order.jfh-099.workers.dev';

interface Order {
  id: string; order_no: string; type: string; total: number; status: string; created_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/orders?limit=50`)
      .then(r => r.json())
      .then(d => setOrders(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-50 text-yellow-600',
      paid: 'bg-blue-50 text-blue-600',
      shipped: 'bg-purple-50 text-purple-600',
      completed: 'bg-green-50 text-green-600',
      cancelled: 'bg-red-50 text-red-600',
    };
    const labels: Record<string, string> = {
      pending: '待付款', paid: '已付款', shipped: '已发货', completed: '已完成', cancelled: '已取消',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || 'bg-gray-50 text-gray-600'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">订单管理</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">订单号</th>
                <th className="px-4 py-3 font-medium">类型</th>
                <th className="px-4 py-3 font-medium">金额</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无订单</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{o.order_no}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="flex items-center gap-1">
                      <ShoppingCart size={14} />
                      {o.type === 'b2b' ? '门店采购' : '消费者'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">¥{o.total.toFixed(2)}</td>
                  <td className="px-4 py-3">{statusBadge(o.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14} />{o.created_at}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
