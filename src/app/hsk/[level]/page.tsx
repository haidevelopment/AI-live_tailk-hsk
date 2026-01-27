import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { getHSKLevel } from '@/data/hsk-levels';
import { getTopicsForLevel } from '@/data/hsk-topics';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Props {
  params: { level: string };
}

export default function TopicSelectionPage({ params }: Props) {
  const level = parseInt(params.level);
  
  if (isNaN(level) || level < 1 || level > 6) {
    notFound();
  }

  const hskLevel = getHSKLevel(level);
  const topics = getTopicsForLevel(level);

  if (!hskLevel) {
    notFound();
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <Link
          href="/hsk"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại chọn cấp độ
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={cn(
              'h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg',
              `bg-gradient-to-br`,
              hskLevel.gradient
            )}
          >
            {hskLevel.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{hskLevel.name}</h1>
            <p className="text-slate-600">{hskLevel.title} - Chọn chủ đề để luyện nói</p>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/talk/${level}/${topic.id}`}
              className="group glass rounded-2xl p-6 card-hover"
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">
                  {topic.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">{topic.name}</h2>
                  <p className="text-sm text-slate-500">{topic.nameZh}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4">{topic.description}</p>

              {/* Sample phrases */}
              <div className="space-y-2 mb-4">
                {topic.samplePhrases.slice(0, 2).map((phrase, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-lg px-3 py-2 text-sm"
                  >
                    <p className="text-slate-800">{phrase.zh}</p>
                    <p className="text-slate-400 text-xs">{phrase.pinyin}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-primary-600">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Bắt đầu nói</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {topics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">Không có chủ đề nào cho cấp độ này.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { level: '1' },
    { level: '2' },
    { level: '3' },
    { level: '4' },
    { level: '5' },
    { level: '6' },
  ];
}
