import { useState } from 'react';
import { Stethoscope, Activity } from 'lucide-react';

const API = 'https://airaquas-api-diagnosis.jfh-099.workers.dev';

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

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 4) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/diagnosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'demo', answers }),
      });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI 头皮诊断</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">填写问卷</h2>
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
            className="mt-6 w-full py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '诊断中...' : '开始诊断'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">诊断结果</h2>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={20} className="text-amber-600" />
                <span className="text-sm text-gray-500">头皮健康评分</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{result.score}</span>
                <span className="text-gray-400">/100</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${result.score >= 70 ? 'bg-green-500' : result.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">头皮类型</p>
              <p className="text-lg font-semibold text-gray-900">
                {result.diagnosis?.name || result.scalp_type}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">建议方案</p>
              <p className="text-gray-700 text-sm leading-relaxed">{result.recommendation}</p>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-800">推荐产品</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.diagnosis?.products?.map((p: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 bg-white rounded-full text-amber-700 border border-amber-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
