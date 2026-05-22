import { useState } from 'react';
import { Megaphone, Copy, Image, Gift } from 'lucide-react';

const API = 'https://airaquas-api-marketing.jfh-099.workers.dev';

const assetTypes = [
  { type: 'poster', label: '海报', icon: Image },
  { type: 'copy', label: '文案', icon: Copy },
  { type: 'coupon', label: '优惠券', icon: Gift },
];

export default function Marketing() {
  const [productName, setProductName] = useState('控油洗发水');
  const [shopName, setShopName] = useState('安柯耳旗舰店');
  const [generated, setGenerated] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const generateAll = async () => {
    setLoading(true);
    const results: Record<string, string> = {};
    for (const at of assetTypes) {
      try {
        const res = await fetch(`${API}/api/marketing/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: at.type, product_name: productName, shop_name: shopName }),
        });
        const data = await res.json();
        results[at.type] = data.content;
      } catch { results[at.type] = '生成失败'; }
    }
    setGenerated(results);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">营销素材</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">AI 一键生成</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
              <input
                type="text" value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">门店名称</label>
              <input
                type="text" value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={generateAll}
              disabled={loading}
              className="w-full py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? '生成中...' : '生成全部素材'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {assetTypes.map((at) => (
            <div key={at.type} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <at.icon size={18} className="text-amber-600" />
                <span className="font-medium text-gray-900">{at.label}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {generated[at.type] || '点击"生成全部素材"按钮'}
              </p>
              {generated[at.type] && (
                <button
                  onClick={() => navigator.clipboard.writeText(generated[at.type])}
                  className="mt-2 text-xs text-amber-600 hover:text-amber-700"
                >
                  复制内容
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
