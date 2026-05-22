import { useEffect, useState } from 'react';
import { Search, Phone, Calendar } from 'lucide-react';

const API = 'https://airaquas-api-crm.jfh-099.workers.dev';

interface Member {
  id: string; name: string; phone: string; type: string; created_at: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/crm/members?limit=50`)
      .then(r => r.json())
      .then(d => setMembers(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(m =>
    m.name?.includes(search) || m.phone?.includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">会员管理</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="搜索姓名或手机号"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">姓名</th>
                <th className="px-4 py-3 font-medium">手机号</th>
                <th className="px-4 py-3 font-medium">类型</th>
                <th className="px-4 py-3 font-medium">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">暂无会员数据</td></tr>
              ) : filtered.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Phone size={14} />{m.phone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                      {m.type === 'customer' ? '消费者' : m.type === 'shop' ? '门店' : m.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14} />{m.created_at}</span>
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
