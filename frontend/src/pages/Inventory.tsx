import { Package, AlertTriangle, Clock } from 'lucide-react';

export default function Inventory() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">库存管理</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总库存</p>
              <p className="text-lg font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">低库存预警</p>
              <p className="text-lg font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">临期商品</p>
              <p className="text-lg font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">选择门店后查看库存明细</p>
        <p className="text-sm text-gray-400 mt-1">API: GET /api/inventory/:shop_id</p>
      </div>
    </div>
  );
}
