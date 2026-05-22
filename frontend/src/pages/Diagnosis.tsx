import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Activity, Sparkles, Cpu, Lightbulb, FlaskConical, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const API = 'https://api.airaquas.hair/diagnosis';

const questions = [
  { key: 'oily', label: '头皮出油程度', options: [
    { value: '1', text: '轻微出油' }, { value: '2', text: '中度出油' },
    { value: '3', text: '严重出油' }, { value: '4', text: '非常严重' },
  ]},
  { key: 'dry', label: '头皮干燥程度', options: [
    { value: '1', text: '轻微干燥' }, { value: '2', text: '中度干燥' },
    { value: '3', text: '严重紧绷' }, { value: '4', text: '脱皮起屑' },
  ]},
  { key: 'sensitive', label: '头皮敏感程度', options: [
    { value: '1', text: '偶尔发痒' }, { value: '2', text: '经常发红' },
    { value: '3', text: '刺痒明显' }, { value: '4', text: '严重过敏' },
  ]},
  { key: 'hair_loss', label: '脱发情况', options: [
    { value: '1', text: '轻微掉发' }, { value: '2', text: '明显掉发' },
    { value: '3', text: '大量掉发' }, { value: '4', text: '严重脱发' },
  ]},
];

export default function Diagnosis() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 4) return;
    if (!isAuthenticated) { navigate('/login'); return; }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/diagnosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user!.id, shop_id: user!.shop_id || null, answers }),
      });
      setResult(await res.json());
    } catch {
      setResult({ success: false, error: '网络请求失败' });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (s: number) =>
    s >= 70 ? 'bg-green-500' : s >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Stethoscope size={22} className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI 头皮诊断</h1>
          <p className="text-sm text-gray-500">基于 AI 智能分析，生成个性化头皮健康报告</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 问卷卡片 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">填写问卷</h2>
          {!isAuthenticated && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 text-sm rounded-lg">
              请先登录后使用诊断功能
            </div>
          )}
          <div className="space-y-5">
            {questions.map((q) => (
              <div key={q.key}>
                <p className="text-sm font-medium text-gray-700 mb-2">{q.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswers({ ...answers, [q.key]: opt.value })}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left
                        ${answers[q.key] === opt.value
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || Object.keys(answers).length < 4}
            className="mt-6 w-full py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">⏳</span> AI 诊断中...</>
            ) : (
              <><Sparkles size={16} /> 开始 AI 诊断</>
            )}
          </button>
        </div>

        {/* 诊断结果 */}
        {result && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">诊断结果</h2>
              {result.ai_generated ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
                  <Sparkles size={12} /> AI 生成
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  <Cpu size={12} /> 规则引擎
                </span>
              )}
            </div>

            {/* 评分 */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-amber-600" />
                <span className="text-sm text-gray-500">头皮健康评分</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{result.score}</span>
                <span className="text-gray-400">/100</span>
              </div>
              <div className="mt-2 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getScoreColor(result.score)}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {result.score >= 70 ? '✅ 状态良好' : result.score >= 40 ? '⚠️ 需要关注' : '🔴 建议到店检查'}
              </p>
            </div>

            {/* 头皮类型 */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">头皮类型</p>
              <p className="text-xl font-bold text-gray-900">{result.scalp_type}</p>
            </div>

            {/* 诊断描述 */}
            {result.diagnosis && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">诊断分析</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{result.diagnosis}</p>
              </div>
            )}

            {/* 护理建议 */}
            {result.advice && (
              <div className="mb-4 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">护理建议</span>
                </div>
                <p className="text-sm text-amber-700 leading-relaxed">{result.advice}</p>
              </div>
            )}

            {/* 推荐产品 */}
            {result.products && result.products.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical size={16} className="text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">推荐产品</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.products.map((p: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-white rounded-full text-amber-700 border border-amber-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 生活建议 */}
            {result.lifestyle && result.lifestyle.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">生活建议</span>
                <ul className="space-y-1">
                  {result.lifestyle.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!result.success && (
              <p className="text-red-500 text-sm">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
