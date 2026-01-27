export interface HSKLevel {
  id: number;
  name: string;
  title: string;
  description: string;
  vocabulary: number;
  color: string;
  gradient: string;
  icon: string;
}

export const hskLevels: HSKLevel[] = [
  {
    id: 1,
    name: 'HSK 1',
    title: '入门 (Nhập môn)',
    description: 'Giao tiếp cơ bản, chào hỏi và giới thiệu bản thân',
    vocabulary: 150,
    color: '#22c55e',
    gradient: 'from-green-400 to-green-600',
    icon: '🌱',
  },
  {
    id: 2,
    name: 'HSK 2',
    title: '初级 (Sơ cấp)',
    description: 'Trao đổi đơn giản về các chủ đề quen thuộc',
    vocabulary: 300,
    color: '#3b82f6',
    gradient: 'from-blue-400 to-blue-600',
    icon: '📚',
  },
  {
    id: 3,
    name: 'HSK 3',
    title: '中级 (Trung cấp)',
    description: 'Giao tiếp tự tin trong cuộc sống hàng ngày',
    vocabulary: 600,
    color: '#8b5cf6',
    gradient: 'from-violet-400 to-violet-600',
    icon: '🎯',
  },
  {
    id: 4,
    name: 'HSK 4',
    title: '中高级 (Trung cao cấp)',
    description: 'Thảo luận đa dạng chủ đề với người bản xứ',
    vocabulary: 1200,
    color: '#f59e0b',
    gradient: 'from-amber-400 to-amber-600',
    icon: '⭐',
  },
  {
    id: 5,
    name: 'HSK 5',
    title: '高级 (Cao cấp)',
    description: 'Đọc báo, xem phim và giao tiếp lưu loát',
    vocabulary: 2500,
    color: '#ef4444',
    gradient: 'from-red-400 to-red-600',
    icon: '🔥',
  },
  {
    id: 6,
    name: 'HSK 6',
    title: '精通 (Tinh thông)',
    description: 'Giao tiếp như người bản xứ, hiểu mọi chủ đề',
    vocabulary: 5000,
    color: '#ec4899',
    gradient: 'from-pink-400 to-pink-600',
    icon: '👑',
  },
];

export function getHSKLevel(level: number): HSKLevel | undefined {
  return hskLevels.find((l) => l.id === level);
}
