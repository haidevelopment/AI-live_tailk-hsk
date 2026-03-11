import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Mic, BookOpen, Trophy, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Real-time AI Conversation
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                Luyện nói tiếng Trung
                <span className="block gradient-text">với AI Tutor</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Hội thoại real-time với AI thông minh. Từ HSK 1 đến HSK 6, 
                AI sẽ điều chỉnh độ khó phù hợp và sửa lỗi phát âm cho bạn.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/hsk"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <Mic className="h-5 w-5" />
                  Bắt đầu luyện nói
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">6</div>
                  <div className="text-sm text-slate-500">Cấp độ HSK</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">10+</div>
                  <div className="text-sm text-slate-500">Chủ đề</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">∞</div>
                  <div className="text-sm text-slate-500">Hội thoại</div>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-100 to-mint-100 opacity-60 blur-2xl"></div>
                
                <div className="relative glass rounded-3xl p-8 shadow-2xl">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="h-32 w-32 flex items-center justify-center">
                        <Image
                          src="/image/hsk-ai.png"
                          alt="HSK AI Avatar"
                          width={128}
                          height={128}
                          className="object-contain"
                          priority
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs">在线</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm max-w-[80%]">
                      <p className="text-slate-800">你好！今天想练习什么？</p>
                      <p className="text-xs text-slate-400 mt-1">Nǐ hǎo! Jīntiān xiǎng liànxí shénme?</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl rounded-br-md p-3 shadow-sm max-w-[80%] ml-auto text-white">
                      <p>我想练习点餐</p>
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm max-w-[80%]">
                      <p className="text-slate-800">好的！我们开始吧 🎉</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg animate-pulse-slow">
                      <Mic className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Tính năng nổi bật</h2>
            <p className="mt-4 text-lg text-slate-600">Trải nghiệm học tiếng Trung hiệu quả nhất</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Real-time Streaming</h3>
              <p className="text-slate-600">
                Hội thoại trực tiếp với AI, không cần chờ đợi. Giọng nói và text được stream liên tục.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 card-hover">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-mint-500 to-teal-600 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Theo chuẩn HSK</h3>
              <p className="text-slate-600">
                Từ vựng và ngữ pháp được điều chỉnh theo từng cấp độ HSK 1-6 của bạn.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 card-hover">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sửa lỗi thông minh</h3>
              <p className="text-slate-600">
                AI sẽ nhận xét và sửa lỗi phát âm, ngữ pháp. Hiển thị pinyin và bản dịch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-mint-500/10"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Sẵn sàng luyện nói?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Chọn cấp độ HSK của bạn và bắt đầu hội thoại với AI tutor ngay bây giờ!
              </p>
              <Link
                href="/hsk"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Chọn cấp độ HSK
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
