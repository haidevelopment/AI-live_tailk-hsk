export interface Topic {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  icon: string;
  levels: number[]; // Which HSK levels this topic is available for
  samplePhrases: {
    zh: string;
    pinyin: string;
    en: string;
  }[];
}

export const topics: Topic[] = [
  {
    id: 'daily-life',
    name: 'Cuộc sống hàng ngày',
    nameZh: '日常生活',
    description: 'Hoạt động thường ngày, thói quen, sinh hoạt',
    icon: '🏠',
    levels: [1, 2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '你好', pinyin: 'Nǐ hǎo', en: 'Hello' },
      { zh: '今天天气很好', pinyin: 'Jīntiān tiānqì hěn hǎo', en: 'The weather is nice today' },
      { zh: '我每天早上六点起床', pinyin: 'Wǒ měitiān zǎoshang liù diǎn qǐchuáng', en: 'I wake up at 6am every day' },
    ],
  },
  {
    id: 'ordering-food',
    name: 'Gọi món ăn',
    nameZh: '点餐',
    description: 'Gọi đồ ăn, thức uống tại nhà hàng',
    icon: '🍜',
    levels: [1, 2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '我要一杯咖啡', pinyin: 'Wǒ yào yī bēi kāfēi', en: 'I want a cup of coffee' },
      { zh: '这个菜辣不辣？', pinyin: 'Zhège cài là bù là?', en: 'Is this dish spicy?' },
      { zh: '请给我菜单', pinyin: 'Qǐng gěi wǒ càidān', en: 'Please give me the menu' },
    ],
  },
  {
    id: 'travel',
    name: 'Du lịch',
    nameZh: '旅游',
    description: 'Đi du lịch, hỏi đường, đặt phòng',
    icon: '✈️',
    levels: [1, 2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '这里怎么走？', pinyin: 'Zhèlǐ zěnme zǒu?', en: 'How do I get here?' },
      { zh: '我想订一个房间', pinyin: 'Wǒ xiǎng dìng yī gè fángjiān', en: 'I want to book a room' },
      { zh: '火车站在哪里？', pinyin: 'Huǒchē zhàn zài nǎlǐ?', en: 'Where is the train station?' },
    ],
  },
  {
    id: 'work',
    name: 'Công việc',
    nameZh: '工作',
    description: 'Môi trường làm việc, họp hành, đồng nghiệp',
    icon: '💼',
    levels: [2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '我在一家公司工作', pinyin: 'Wǒ zài yī jiā gōngsī gōngzuò', en: 'I work at a company' },
      { zh: '今天有会议吗？', pinyin: 'Jīntiān yǒu huìyì ma?', en: 'Is there a meeting today?' },
      { zh: '这个项目很重要', pinyin: 'Zhège xiàngmù hěn zhòngyào', en: 'This project is very important' },
    ],
  },
  {
    id: 'social',
    name: 'Giao tiếp xã hội',
    nameZh: '社交',
    description: 'Kết bạn, trò chuyện, sự kiện xã hội',
    icon: '👥',
    levels: [2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '很高兴认识你', pinyin: 'Hěn gāoxìng rènshi nǐ', en: 'Nice to meet you' },
      { zh: '你周末有空吗？', pinyin: 'Nǐ zhōumò yǒu kòng ma?', en: 'Are you free this weekend?' },
      { zh: '我们去喝杯咖啡吧', pinyin: 'Wǒmen qù hē bēi kāfēi ba', en: "Let's go for coffee" },
    ],
  },
  {
    id: 'education',
    name: 'Giáo dục',
    nameZh: '教育',
    description: 'Học tập, trường lớp, thi cử',
    icon: '🎓',
    levels: [2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '我是学生', pinyin: 'Wǒ shì xuésheng', en: 'I am a student' },
      { zh: '这门课很有意思', pinyin: 'Zhè mén kè hěn yǒu yìsi', en: 'This course is very interesting' },
      { zh: '考试准备得怎么样？', pinyin: 'Kǎoshì zhǔnbèi de zěnmeyàng?', en: 'How is your exam preparation?' },
    ],
  },
  {
    id: 'shopping',
    name: 'Mua sắm',
    nameZh: '购物',
    description: 'Mua hàng, trả giá, thanh toán',
    icon: '🛍️',
    levels: [1, 2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '这个多少钱？', pinyin: 'Zhège duōshao qián?', en: 'How much is this?' },
      { zh: '太贵了，便宜一点', pinyin: 'Tài guì le, piányi yīdiǎn', en: "Too expensive, a bit cheaper" },
      { zh: '我可以试穿吗？', pinyin: 'Wǒ kěyǐ shìchuān ma?', en: 'Can I try it on?' },
    ],
  },
  {
    id: 'health',
    name: 'Sức khỏe',
    nameZh: '健康',
    description: 'Khám bệnh, triệu chứng, nhà thuốc',
    icon: '🏥',
    levels: [2, 3, 4, 5, 6],
    samplePhrases: [
      { zh: '我头疼', pinyin: 'Wǒ tóu téng', en: 'I have a headache' },
      { zh: '我需要看医生', pinyin: 'Wǒ xūyào kàn yīshēng', en: 'I need to see a doctor' },
      { zh: '这个药怎么吃？', pinyin: 'Zhège yào zěnme chī?', en: 'How do I take this medicine?' },
    ],
  },
  {
    id: 'business',
    name: 'Kinh doanh',
    nameZh: '商务',
    description: 'Đàm phán, hợp đồng, thương mại',
    icon: '📈',
    levels: [5, 6],
    samplePhrases: [
      { zh: '我们来谈谈合作的事', pinyin: 'Wǒmen lái tántan hézuò de shì', en: "Let's discuss cooperation" },
      { zh: '这个价格可以接受', pinyin: 'Zhège jiàgé kěyǐ jiēshòu', en: 'This price is acceptable' },
      { zh: '请签署这份合同', pinyin: 'Qǐng qiānshǔ zhè fèn hétong', en: 'Please sign this contract' },
    ],
  },
  {
    id: 'culture',
    name: 'Văn hóa',
    nameZh: '文化',
    description: 'Phong tục, lễ hội, nghệ thuật Trung Quốc',
    icon: '🏮',
    levels: [3, 4, 5, 6],
    samplePhrases: [
      { zh: '春节是中国最重要的节日', pinyin: 'Chūnjié shì Zhōngguó zuì zhòngyào de jiérì', en: 'Spring Festival is the most important Chinese holiday' },
      { zh: '你喜欢中国茶吗？', pinyin: 'Nǐ xǐhuan Zhōngguó chá ma?', en: 'Do you like Chinese tea?' },
      { zh: '这幅画真漂亮', pinyin: 'Zhè fú huà zhēn piàoliang', en: 'This painting is beautiful' },
    ],
  },
];

export function getTopicsForLevel(level: number): Topic[] {
  return topics.filter((topic) => topic.levels.includes(level));
}

export function getTopic(topicId: string): Topic | undefined {
  return topics.find((t) => t.id === topicId);
}
