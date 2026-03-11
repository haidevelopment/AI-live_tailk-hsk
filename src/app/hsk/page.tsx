import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { hskLevels } from '@/data/hsk-levels';
import { cn } from '@/lib/utils';

export default function HSKLevelPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Chọn cấp độ <span className="gradient-text">HSK</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Chọn cấp độ phù hợp với trình độ hiện tại của bạn. 
            AI sẽ điều chỉnh từ vựng và tốc độ nói phù hợp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hskLevels.map((level) => (
            <Link
              key={level.id}
              href={`/hsk/${level.id}`}
              className="group glass rounded-2xl p-6 card-hover relative overflow-hidden"
            >
              <div
                className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity',
                  `bg-gradient-to-br`,
                  level.gradient
                )}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      'h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg',
                      `bg-gradient-to-br`,
                      level.gradient
                    )}
                  >
                    {level.icon}
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${level.color}20`, color: level.color }}
                  >
                    {level.vocabulary}+ từ
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1">{level.name}</h2>
                <p className="text-sm font-medium text-slate-500 mb-2">{level.title}</p>
                <p className="text-slate-600 text-sm mb-4">{level.description}</p>

                <div className="flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                  <span>Chọn chủ đề</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 glass rounded-2xl p-6 text-center max-w-2xl mx-auto">
          <p className="text-slate-600">
            💡 <strong>Mẹo:</strong> Nếu bạn mới học, hãy bắt đầu với HSK 1. 
            Bạn có thể thay đổi cấp độ bất cứ lúc nào.
          </p>
        </div>
      </div>
    </div>
  );
}
