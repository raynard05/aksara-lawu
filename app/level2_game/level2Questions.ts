export interface Level2QuestionItem {
  id: number;
  questionText: string;
  image?: string;
  options: {
    key: "a" | "b";
    text: string;
  }[];
  correctKey: "a" | "b";
}

export const ALL_LEVEL2_QUESTIONS: Level2QuestionItem[] = [
  {
    id: 1,
    questionText: "ꦕꦤ꧀ꦝꦶꦲꦥꦲꦶꦏꦶ?",
    image: "/labirin_pendakian/cetho.webp",
    options: [
      { key: "a", text: "ꦕꦤ꧀ꦝꦶꦕꦼꦛꦺꦴ" },
      { key: "b", text: "ꦕꦤ꧀ꦝꦶꦱꦢꦺꦴꦤ꧀" },
    ],
    correctKey: "a",
  },
  {
    id: 2,
    questionText: "ꦕꦤ꧀ꦝꦶꦲꦥꦲꦶꦏꦶ?",
    image: "/labirin_pendakian/sukuh.webp",
    options: [
      { key: "a", text: "ꦕꦤ꧀ꦝꦶꦏꦼꦛꦺꦏ꧀" },
      { key: "b", text: "ꦕꦤ꧀ꦝꦶꦱꦸꦏꦸꦃ" },
    ],
    correctKey: "b",
  },
  {
    id: 3,
    questionText: "ꦕꦤ꧀ꦝꦶꦲꦥꦲꦶꦏꦶ?",
    image: "/labirin_pendakian/kethek.webp",
    options: [
      { key: "a", text: "ꦕꦤ꧀ꦝꦶꦏꦼꦛꦺꦏ꧀" },
      { key: "b", text: "ꦕꦤ꧀ꦝꦶꦕꦼꦛꦺꦴ" },
    ],
    correctKey: "a",
  },
  {
    id: 4,
    questionText: "ꦕꦤ꧀ꦝꦶꦲꦥꦲꦶꦏꦶ?",
    image: "/labirin_pendakian/sadon.webp",
    options: [
      { key: "a", text: "ꦕꦤ꧀ꦝꦶꦱꦸꦏꦸꦃ" },
      { key: "b", text: "ꦕꦤ꧀ꦝꦶꦱꦢꦺꦴꦤ꧀" },
    ],
    correctKey: "b",
  },
  {
    id: 5,
    questionText: "꧋ꦕꦤ꧀ꦝꦶꦱꦸꦏꦸꦃꦢꦸꦩꦸꦤꦸꦁꦲꦶꦁꦏꦮꦱꦤ꧀ꦒꦸꦤꦸꦁꦲꦥ?",
    options: [
      { key: "a", text: "ꦒꦸꦤꦸꦁꦭꦮꦸ" },
      { key: "b", text: "ꦒꦸꦤꦸꦁꦏꦼꦭꦸꦢ꧀" },
    ],
    correctKey: "a",
  },
  {
    id: 6,
    questionText: "ꦕꦤ꧀ꦝꦶꦏꦼꦛꦺꦏ꧀ꦢꦸꦩꦸꦤꦸꦁꦲꦶꦁꦏꦧꦸꦥꦠꦺꦤ꧀ꦲꦼꦤ꧀ꦢꦶ?",
    options: [
      { key: "a", text: "ꦔꦮꦶ" },
      { key: "b", text: "ꦏꦫꦔꦚꦂ" },
    ],
    correctKey: "b",
  },
  {
    id: 7,
    questionText: "ꦕꦤ꧀ꦝꦶꦱꦢꦺꦴꦤ꧀ꦢꦸꦩꦸꦤꦸꦁꦲꦶꦁꦏꦮꦱꦤ꧀ꦒꦸꦤꦸꦁꦲꦥ?",
    options: [
      { key: "a", text: "ꦩꦒꦺꦠꦤ꧀" },
      { key: "b", text: "ꦏꦫꦔꦚꦂ" },
    ],
    correctKey: "a",
  },
  {
    id: 8,
    questionText: "꧋ꦕꦤ꧀ꦝꦶꦲꦥꦱꦶꦁꦢꦶꦏꦼꦤꦭ꧀ꦏꦤ꧀ꦛꦶꦮꦔꦸꦤ꧀ꦮꦔꦸꦤꦤ꧀ꦏꦪꦥꦶꦫꦩꦶꦣꦲꦸꦤ꧀ꦝꦏ꧀ꦲꦸꦤ꧀ꦝꦏꦤ꧀?",
    options: [
      { key: "a", text: "ꦕꦤ꧀ꦝꦶꦱꦸꦏꦸꦃ" },
      { key: "b", text: "ꦕꦤ꧀ꦝꦶꦱꦢꦺꦴꦤ꧀" },
    ],
    correctKey: "a",
  },
];

