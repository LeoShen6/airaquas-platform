import { DollarSign, TrendingUp, Wallet } from 'lucide-react';

const API = 'https://airaquas-api-profit.jfh-099.workers.dev';

export default function Profit() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">分润中心</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已结算</p>
              <p className="text-lg font-bold text-gray-900">¥0.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待结算</p>
              <p className="text-lg font-bold text-gray-900">¥0.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总交易</p>
              <p className="text-lg font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">分润规则</h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="font-medium text-gray-900">引流佣金</p>
            <p className="text-sm text-gray-500 mt-1">门店成功推荐新客户 → 固定金额奖励</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="font-medium text-gray-900">销售提成</p>
            <p className="text-sm text-gray-500 mt-1">店员完成销售 → 按销售额百分比提成</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="font-medium text-gray-900">阶梯奖励</p>
            <p className="text-sm text-gray-500 mt-1">月度/季度达标 → 额外冲单奖励</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          💡 有订单数据后，分润将自动计算。门店可在后台查看实时收益并申请提现。
        </p>
      </div>
    </div>
  );
}
