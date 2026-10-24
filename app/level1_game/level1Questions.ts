export interface QuestionOption {
  symbolId: "o" | "plus" | "x" | "y";
  originalLabel: "a" | "b" | "c" | "d";
  text: string;
}

export interface QuestionItem {
  id: number;
  question: string;
  options: QuestionOption[];
  correctSymbolId: "o" | "plus" | "x" | "y";
}

// 20 Soal dan Kunci Jawaban Lengkap dari level1game.txt
// Sesuai pemetaan ikon:
// a -> o
// b -> plus (+)
// c -> x
// d -> Y
export const LEVEL1_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: "꧋ꦒꦸꦤꦸꦁ ꦭꦮꦸ ꦢꦸꦩꦸꦤꦸꦁ ꦲꦶꦁꦠꦥꦺꦭ꧀ꦮꦠꦼꦱ꧀ꦥꦿꦺꦴꦥꦶꦤ꧀ꦱꦶꦲꦼꦤ꧀ꦢꦶ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦗꦮꦠꦶꦩꦸꦂꦭꦤ꧀ꦗꦮꦧꦫꦠ꧀" },
      { symbolId: "plus", originalLabel: "b", text: "ꦗꦮꦠꦼꦔꦃꦭꦤ꧀ꦗꦮꦠꦶꦩꦸꦂ" },
      { symbolId: "x", originalLabel: "c", text: "ꦗꦮꦠꦼꦔꦃꦭꦤ꧀ꦪꦺꦴꦒꦾꦏꦂꦠ" },
      { symbolId: "y", originalLabel: "d", text: "ꦗꦮꦧꦫꦠ꧀ꦭꦤ꧀ꦪꦺꦴꦒꦾꦏꦂꦠ" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 2,
    question: "꧋ꦲꦥꦗꦼꦤꦼꦁꦮꦶꦮꦶꦠꦤ꧀ꦒꦸꦤꦸꦁꦭꦮꦸꦲꦶꦁꦏꦶꦠꦧ꧀ꦠꦤ꧀ꦠꦸꦥꦁꦒꦼꦭꦫꦤ꧀?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦩꦲꦩꦺꦫꦸ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦏꦠꦺꦴꦁ" },
      { symbolId: "x", originalLabel: "c", text: "ꦭꦸꦩꦮꦸꦭꦮꦺꦴ" },
      { symbolId: "y", originalLabel: "d", text: "ꦲꦂꦒꦺꦴꦢꦭꦼꦩ꧀" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 3,
    question: "꧋ꦒꦸꦤꦸꦁꦭꦮꦸꦢꦶꦥꦼꦂꦕꦪꦩꦶꦤꦁꦏꦥꦼꦕꦲꦤ꧀ꦱꦏꦒꦸꦤꦸꦁꦲꦥ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦒꦸꦤꦸꦁꦱꦼꦩꦺꦫꦸ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦒꦸꦤꦸꦁꦩꦼꦫꦥꦶ" },
      { symbolId: "x", originalLabel: "c", text: "ꦒꦸꦤꦸꦁꦩꦲꦩꦺꦫꦸ" },
      { symbolId: "y", originalLabel: "d", text: "ꦒꦸꦤꦸꦁꦩꦼꦂꦧꦧꦸ" },
    ],
    correctSymbolId: "x", // c
  },
  {
    id: 4,
    question: "꧋ꦩꦶꦠꦸꦫꦸꦠ꧀ꦮꦕꦤ꧀‌ꦗꦼꦤꦼꦁꦭꦮꦸꦢꦶꦲꦫꦤꦶꦲꦱꦭꦺꦱꦏꦠꦼꦩ꧀ꦧꦸꦁꦲꦥ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦭꦸꦩꦮꦸꦭꦮꦺꦴ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦠꦤ꧀ꦠꦸꦥꦁꦒꦼꦭꦫꦤ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦧꦸꦗꦁꦒꦩꦤꦶꦏ꧀" },
      { symbolId: "y", originalLabel: "d", text: "ꦮꦁꦱꦩꦼꦁꦒꦭ" },
    ],
    correctSymbolId: "o", // a
  },
  {
    id: 5,
    question: "꧋ꦲꦥꦱꦶꦁꦢꦶꦒꦩ꧀ꦧꦫꦏꦺꦱꦏꦠꦼꦩ꧀ꦧꦸꦁꦭꦸꦩꦮꦸꦭꦮꦺꦴ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦒꦸꦤꦸꦁꦱꦶꦁꦏꦼꦉꦥ꧀ꦲꦚ꧀ꦗꦺꦧ꧀ꦭꦸꦒ꧀" },
      { symbolId: "plus", originalLabel: "b", text: "ꦒꦸꦤꦸꦁꦱꦶꦁꦏꦼꦧꦏ꧀ꦲꦭꦱ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦒꦸꦤꦸꦁꦱꦶꦁꦏꦠꦺꦴꦤ꧀ꦒꦼꦣꦺꦭꦤ꧀ꦩꦼꦒꦃꦱꦏꦏꦢꦺꦴꦲꦤ꧀" },
      { symbolId: "y", originalLabel: "d", text: "ꦒꦸꦤꦸꦁꦱꦶꦁꦢꦢꦶꦥꦥꦤ꧀ꦠꦼꦠꦤꦺꦤ꧀" },
    ],
    correctSymbolId: "x", // c
  },
  {
    id: 6,
    question: "꧋ꦤꦱ꧀ꦏꦃꦏꦸꦤꦲꦥꦱꦶꦁꦚꦜꦼꦠ꧀ꦒꦸꦤꦸꦁꦭꦮꦸ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦧꦸꦗꦁꦒꦩꦤꦶꦏ꧀ꦭꦤ꧀ꦱꦼꦫꦠ꧀ꦕꦼꦤ꧀ꦛꦶꦤꦶ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦤꦼꦒꦫꦏꦼꦂꦠꦒꦩꦭꦤ꧀ꦱꦸꦠꦱꦺꦴꦩ" },
      { symbolId: "x", originalLabel: "c", text: "ꦥꦫꦫꦠꦺꦴꦤ꧀ꦭꦤ꧀ꦲꦂꦗꦸꦤꦮꦶꦮꦲ" },
      { symbolId: "y", originalLabel: "d", text: "ꦱꦼꦫꦠ꧀ꦏꦭꦠꦶꦣꦭꦤ꧀ꦱꦼꦫꦠ꧀ꦮꦼꦣꦠꦩ" },
    ],
    correctSymbolId: "o", // a
  },
  {
    id: 7,
    question: "꧋ꦱꦼꦗꦫꦃꦒꦸꦤꦸꦁꦭꦮꦸꦲꦤꦒꦤ꧀ꦝꦺꦔꦤꦺꦏꦫꦺꦴꦏꦼꦢꦢꦺꦪꦤ꧀ꦲꦥ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦫꦸꦤ꧀ꦠꦸꦲꦺꦏꦫꦗꦤ꧀ꦩꦗꦥꦲꦶꦠ꧀" },
      { symbolId: "plus", originalLabel: "b", text: "ꦩꦢꦼꦒꦺꦏꦫꦗꦤ꧀ꦢꦼꦩꦏ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦥꦼꦫꦁꦢꦶꦥꦺꦴꦤꦼꦒꦺꦴꦫꦺꦴ" },
      { symbolId: "y", originalLabel: "d", text: "ꦩꦢꦼꦒꦺꦏꦫꦗꦤ꧀ꦩꦠꦫꦩ꧀ꦲꦶꦱ꧀ꦭꦩ꧀" },
    ],
    correctSymbolId: "o", // a
  },
  {
    id: 8,
    question: "꧋ꦱꦥꦫꦗꦱꦶꦁꦩꦶꦠꦸꦫꦸꦠ꧀ꦭꦼꦒꦺꦤ꧀ꦝꦠꦶꦤ꧀ꦢꦏ꧀ꦩꦼꦚꦁꦒꦸꦤꦸꦁꦭꦮꦸ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦲꦪꦩ꧀ꦮꦸꦫꦸꦏ꧀" },
      { symbolId: "plus", originalLabel: "b", text: "ꦏꦺꦤ꧀ꦲꦫꦺꦴꦏ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦥꦿꦧꦸꦧꦿꦮꦶꦗꦪ" },
      { symbolId: "y", originalLabel: "d", text: "ꦫꦢꦺꦤ꧀ꦮꦶꦗꦪ" },
    ],
    correctSymbolId: "x", // c
  },
  {
    id: 9,
    question: "꧋ꦱꦥꦮꦲꦺꦥꦼꦔꦶꦏꦸꦠ꧀ꦥꦿꦧꦸꦧꦿꦮꦶꦗꦪ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦒꦗꦃꦩꦣ꧈ꦲꦪꦩ꧀ꦮꦸꦫꦸꦏ꧀‌ꦭꦤ꧀ꦏꦼꦤ꧀ꦲꦫꦺꦴꦏ꧀" },
      { symbolId: "plus", originalLabel: "b", text: "ꦱꦧ꧀ꦢꦺꦴꦥꦭꦺꦴꦤ꧀‌ꦢꦶꦥꦩꦼꦁꦒꦭ꧈ꦭꦤ꧀ꦮꦁꦱꦩꦼꦁꦒꦭ" },
      { symbolId: "x", originalLabel: "c", text: "ꦢꦶꦥꦩꦼꦁꦒꦭ꧈ꦒꦗꦃꦩꦣ꧈ꦭꦤ꧀ꦫꦢꦺꦤ꧀ꦮꦶꦗꦪ" },
      { symbolId: "y", originalLabel: "d", text: "ꦱꦧ꧀ꦢꦺꦴꦥꦭꦺꦴꦤ꧀‌ꦲꦪꦩ꧀ꦮꦸꦫꦸꦏ꧀‌ꦭꦤ꧀ꦏꦺꦤ꧀ꦲꦫꦺꦴꦏ꧀" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 10,
    question: "꧋ꦲꦶꦁꦔꦼꦤ꧀ꦢꦶꦥꦿꦧꦸꦧꦿꦮꦶꦗꦪꦢꦶꦥꦼꦂꦕꦪꦔꦭꦩꦶꦩꦺꦴꦏ꧀ꦱ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦲꦂꦒꦺꦴꦢꦸꦩꦶꦭꦃ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦲꦂꦒꦺꦴꦢꦭꦼꦩ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦕꦤ꧀ꦝꦶꦱꦸꦏꦸꦃ" },
      { symbolId: "y", originalLabel: "d", text: "ꦕꦤ꧀ꦝꦶꦕꦼꦛꦺꦴ" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 11,
    question: "꧋ꦲꦥꦠꦼꦒꦼꦱꦺꦩꦺꦴꦏ꧀ꦱꦩꦶꦠꦸꦫꦸꦠ꧀ꦮꦕꦤ꧀ꦏꦱꦼꦧꦸꦠ꧀?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦲꦁꦭꦏꦺꦴꦤꦶꦱꦼꦩꦺꦢꦶꦲꦶꦁꦒꦸꦤꦸꦁ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦤꦶꦁꦒꦭꦏꦺꦏꦿꦠꦺꦴꦤ꧀ꦏꦁꦒꦺꦴꦥꦼꦫꦁ" },
      { symbolId: "x", originalLabel: "c", text: "ꦲꦸꦮꦭ꧀ꦱꦏꦢꦺꦴꦚꦏꦢꦺꦴꦚꦤ꧀" },
      { symbolId: "y", originalLabel: "d", text: "ꦔꦢꦼꦒ꧀ꦲꦏꦺꦥꦥꦤ꧀ꦥꦔꦶꦧꦢꦃ" },
    ],
    correctSymbolId: "x", // c
  },
  {
    id: 12,
    question: "꧋ꦕꦿꦶꦠꦥꦿꦧꦸꦧꦿꦮꦶꦗꦪꦲꦶꦁꦒꦸꦤꦸꦁꦭꦮꦸꦏꦭꦼꦧꦸꦕꦿꦶꦠꦲꦥ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦭꦼꦒꦺꦤ꧀ꦝ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦢꦺꦴꦔꦺꦁꦏꦺꦮꦤ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦕꦿꦶꦠꦥꦼꦔꦭꦩꦤ꧀" },
      { symbolId: "y", originalLabel: "d", text: "ꦕꦿꦶꦠꦒꦸꦪꦺꦴꦤꦤ꧀" },
    ],
    correctSymbolId: "o", // a
  },
  {
    id: 13,
    question: "꧋ꦱꦥꦱꦶꦁꦲꦶꦱꦶꦃꦔꦸꦂꦩꦠꦶꦭꦼꦒꦺꦤ꧀ꦝꦥꦿꦧꦸꦧꦿꦮꦶꦗꦪꦩꦶꦠꦸꦫꦸꦠ꧀ꦮꦕꦤ꧀?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦥꦫꦥꦼꦢꦒꦁꦭꦤ꧀ꦥꦼꦠꦤꦶ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦥꦫꦲꦶꦭ꧀ꦩꦸꦮꦤ꧀ꦭꦤ꧀ꦒꦸꦫꦸ" },
      { symbolId: "x", originalLabel: "c", text: "ꦥꦫꦥꦼꦤ꧀ꦢꦏꦶꦭꦤ꧀ꦥꦼꦗꦶꦲꦫꦃ" },
      { symbolId: "y", originalLabel: "d", text: "ꦥꦫꦤꦼꦭꦪꦤ꧀ꦭꦤ꧀ꦥꦼꦭꦲꦸꦠ꧀" },
    ],
    correctSymbolId: "x", // c
  },
  {
    id: 14,
    question: "꧋ꦲꦥꦱꦶꦁꦢꦶꦠꦶꦁꦒꦭꦏꦺꦥꦿꦧꦸꦧꦿꦮꦶꦗꦪꦤꦭꦶꦏꦠꦶꦤ꧀ꦢꦏ꧀ꦩꦼꦚꦁꦒꦸꦤꦸꦁꦭꦮꦸ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦥꦥꦤ꧀ꦥꦔꦶꦧꦢꦃ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦏꦿꦠꦺꦴꦤ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦥꦱꦂ" },
      { symbolId: "y", originalLabel: "d", text: "ꦥꦼꦭꦧꦸꦲꦤ꧀" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 15,
    question: "꧋ꦕꦤ꧀ꦝꦶꦲꦥꦮꦲꦺꦱꦶꦁꦢꦸꦩꦸꦤꦸꦁꦲꦶꦁꦭꦺꦫꦺꦁꦒꦸꦤꦸꦁꦭꦮꦸ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦕꦤ꧀ꦝꦶꦧꦺꦴꦫꦺꦴꦧꦸꦢꦸꦂꦭꦤ꧀ꦕꦤ꧀ꦝꦶꦥꦿꦩ꧀ꦧꦤꦤ꧀" },
      { symbolId: "plus", originalLabel: "b", text: "ꦕꦤ꧀ꦝꦶꦱꦸꦏꦸꦃꦭꦤ꧀ꦕꦤ꧀ꦝꦶꦕꦼꦛꦺꦴ" },
      { symbolId: "x", originalLabel: "c", text: "ꦕꦤ꧀ꦝꦶꦱꦶꦔꦱꦫꦶꦭꦤ꧀ꦕꦤ꧀ꦝꦶꦗꦒꦺꦴ" },
      { symbolId: "y", originalLabel: "d", text: "ꦕꦤ꧀ꦝꦶꦥꦼꦤꦠꦫꦤ꧀ꦭꦤ꧀ꦕꦤ꧀ꦝꦶꦠꦶꦏꦸꦱ꧀" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 16,
    question: "꧋ꦲꦥꦠꦶꦠꦶꦏꦤ꧀ꦮꦔꦸꦤ꧀ꦕꦤ꧀ꦝꦶꦱꦸꦏꦸꦃꦭꦤ꧀ꦕꦤ꧀ꦝꦶꦕꦼꦛꦺꦴꦩꦶꦠꦸꦫꦸꦠ꧀ꦮꦕꦤ꧀?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦮꦔꦸꦤ꧀ꦏꦸꦧꦃꦒꦼꦣꦺ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦮꦔꦸꦤ꧀ꦥꦸꦤ꧀ꦝꦺꦤ꧀ꦲꦸꦤ꧀ꦝꦏ꧀ꦲꦸꦤ꧀ꦝꦏꦤ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦮꦔꦸꦤ꧀ꦩꦼꦤꦫꦣꦸꦮꦸꦂ" },
      { symbolId: "y", originalLabel: "d", text: "ꦮꦔꦸꦤ꧀ꦲꦺꦴꦩꦃꦥꦁꦒꦸꦁ" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 17,
    question: "꧋ꦲꦥꦱꦸꦩ꧀ꦧꦼꦂꦕꦿꦶꦠꦧꦧꦒꦤ꧀ꦲꦱꦭ꧀ꦲꦸꦱꦸꦭ꧀ꦒꦸꦤꦸꦁꦭꦮꦸꦱꦶꦁꦢꦶꦱꦼꦧꦸꦠꦏꦺꦲꦶꦁꦮꦕꦤ꧀?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦧꦸꦏꦸꦥꦼꦭꦗꦫꦤ꧀ꦲꦚꦂ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦏꦶꦠꦧ꧀ꦠꦤ꧀ꦠꦸꦥꦁꦒꦼꦭꦫꦤ꧀" },
      { symbolId: "x", originalLabel: "c", text: "ꦏꦺꦴꦫꦤ꧀ꦗꦩꦤ꧀ꦭꦮꦱ꧀" },
      { symbolId: "y", originalLabel: "d", text: "ꦕꦛꦼꦠꦤ꧀ꦮꦶꦱꦠꦮꦤ꧀" },
    ],
    correctSymbolId: "plus", // b
  },
  {
    id: 18,
    question: "꧋ꦱꦭꦶꦪꦤꦺꦠꦤ꧀ꦠꦸꦥꦁꦒꦼꦭꦫꦤ꧀‌ꦤꦱ꧀ꦏꦃꦏꦸꦤꦲꦥꦱꦶꦁꦢꦶꦱꦼꦧꦸꦠꦏꦺꦲꦶꦁꦮꦕꦤ꧀?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦧꦸꦗꦁꦒꦩꦤꦶꦏ꧀ꦭꦤ꧀ꦱꦼꦫꦠ꧀ꦕꦼꦤ꧀ꦛꦶꦤꦶ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦱꦸꦠꦱꦺꦴꦩꦭꦤ꧀ꦱꦼꦫꦠ꧀ꦮꦼꦣꦠꦩ" },
      { symbolId: "x", originalLabel: "c", text: "ꦥꦫꦫꦠꦺꦴꦤ꧀ꦭꦤ꧀ꦱꦼꦫꦠ꧀ꦏꦭꦠꦶꦣ" },
      { symbolId: "y", originalLabel: "d", text: "ꦤꦼꦒꦫꦏꦼꦂꦠꦒꦩꦭꦤ꧀ꦲꦂꦗꦸꦤꦮꦶꦮꦲ" },
    ],
    correctSymbolId: "o", // a
  },
  {
    id: 19,
    question: "꧋ꦱꦥꦠꦺꦴꦏꦺꦴꦃꦱꦶꦁꦢꦶꦥꦼꦂꦕꦪꦔꦭꦩꦶꦩꦺꦴꦏ꧀ꦱꦲꦶꦁꦲꦂꦒꦺꦴꦢꦭꦼꦩ꧀?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦱꦧ꧀ꦢꦺꦴ ꦥꦭꦺꦴꦤ꧀" },
      { symbolId: "plus", originalLabel: "b", text: "ꦢꦶꦥ ꦩꦼꦤ꧀ꦒ꧀ꦒꦭ" },
      { symbolId: "x", originalLabel: "c", text: "ꦮꦤ꧀ꦒ꧀ꦱ ꦩꦼꦤ꧀ꦒ꧀ꦒꦭ" },
      { symbolId: "y", originalLabel: "d", text: "ꦥꦿꦧꦸꦧꦸꦮꦶꦗꦪ" },
    ],
    correctSymbolId: "y", // d
  },
  {
    id: 20,
    question: "꧋ꦲꦥꦱꦶꦁꦢꦢꦶꦧꦸꦏ꧀ꦠꦶꦲꦤꦤꦺꦠꦶꦁꦒꦭꦤ꧀ꦧꦸꦢꦪꦲꦶꦁꦭꦺꦫꦺꦁꦒꦸꦤꦸꦁꦭꦮꦸ?",
    options: [
      { symbolId: "o", originalLabel: "a", text: "ꦥꦱꦂ ꦱꦪꦸꦂ" },
      { symbolId: "plus", originalLabel: "b", text: "ꦕꦤ꧀ꦝꦶ ꦱꦸꦏꦸꦃꦭꦤ꧀ꦕꦤ꧀ꦝꦶꦕꦼꦛꦺꦴ" },
      { symbolId: "x", originalLabel: "c", text: "ꦥꦧꦿꦶꦏ꧀ꦭꦤ꧀ꦒꦸꦢꦁ" },
      { symbolId: "y", originalLabel: "d", text: "ꦱꦮꦃ" },
    ],
    correctSymbolId: "plus", // b
  },
];

/**
 * Mengambil paket 3 soal acak untuk sesi permainan Pos 1.
 * Mengacak urutan soal secara independen sehingga setiap pemain mendapatkan soal berbeda.
 */
export function getRandomLevel1Questions(): QuestionItem[] {
  const shuffled = [...LEVEL1_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}
