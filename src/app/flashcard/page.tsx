import Link from 'next/link';
import { ArrowLeft, Layers, Construction } from 'lucide-react';

export default function FlashcardPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </Link>

        {/* Content */}
        <div className="glass rounded-3xl p-12">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto mb-6">
            <Construction className="h-10 w-10 text-amber-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Flashcard
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Tính năng Flashcard đang được phát triển. 
            Bạn sẽ sớm có thể học từ vựng HSK với flashcard thông minh!
          </p>

          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Layers className="h-5 w-5" />
            <span>Coming Soon</span>
          </div>
        </div>

        {/* Redirect suggestion */}
        <div className="mt-8">
          <p className="text-slate-600 mb-4">Trong khi chờ đợi, bạn có thể:</p>
          <Link
            href="/hsk"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Luyện nói với AI
          </Link>
        </div>
      </div>
    </div>
  );
}
