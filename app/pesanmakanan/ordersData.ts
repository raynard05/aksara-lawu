export interface FoodItemInfo {
  id: string;
  name: string;
  aksara: string;
  image: string;
}

export const FOOD_ITEMS: FoodItemInfo[] = [
  { id: "tepotahu", name: "Tepo Tahu", aksara: "ꦠꦺꦥꦺꦴꦠꦲꦸ", image: "/warungngaso/makanan/tepotahu.webp" },
  { id: "segorogoh", name: "Sego Rogoh", aksara: "ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ", image: "/warungngaso/makanan/segorogoh.webp" },
  { id: "jenangcandi", name: "Jenang Candi", aksara: "ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ", image: "/warungngaso/makanan/jenangcandi.webp" },
  { id: "kerupuklempeng", name: "Kerupuk Lempeng", aksara: "ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ", image: "/warungngaso/makanan/kerupuklempeng.webp" },
  { id: "bolumagetan", name: "Bolu Magetan", aksara: "ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀", image: "/warungngaso/makanan/bolumagetan.webp" },
  { id: "ayampangangganggandu", name: "Ayam Panggang Gandu", aksara: "ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ", image: "/warungngaso/makanan/ayampangangganggandu.webp" }
];

export interface WarungOrder {
  id: number;
  latin: string;
  aksara: string;
  targetFoodIds: string[];
}

export const WARUNG_ORDERS: WarungOrder[] = [
  {
    "id": 1,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu sing rasane legi, gurih, lan pedhes, uga jenang candi lan sego rogoh. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸꦱꦶꦁꦫꦱꦤꦺꦭꦼꦒꦶ꧈ꦒꦸꦫꦶꦃ꧈ꦭꦤ꧀ꦥꦼꦣꦼꦱ꧀‌ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "jenangcandi",
      "segorogoh"
    ]
  },
  {
    "id": 2,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh sing disajikake nganggo kendil, uga kerupuk lempeng lan bolu Magetan. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦱꦶꦁꦢꦶꦱꦗꦶꦏꦏꦺꦔꦁꦒꦺꦴꦏꦼꦤ꧀ꦢꦶꦭ꧀ꦲꦸꦒꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ ꦭꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧈ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "kerupuklempeng",
      "bolumagetan"
    ]
  },
  {
    "id": 3,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu sing dipanggang nganggo kayu bakar, uga tepo tahu lan jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸꦱꦶꦁꦢꦶꦥꦁꦒꦁꦔꦁꦒꦺꦴꦏꦪꦸꦧꦏꦂ꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "tepotahu",
      "jenangcandi"
    ]
  },
  {
    "id": 4,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi saka Desa Candi, uga bolu Magetan lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦱꦏꦢꦺꦱꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "bolumagetan",
      "kerupuklempeng"
    ]
  },
  {
    "id": 5,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen bolu Magetan sing kalebu jajanan panggang, uga sego rogoh lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦱꦶꦁꦏꦭꦼꦧꦸꦗꦗꦤꦤ꧀ꦥꦁꦒꦁ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ ꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "bolumagetan",
      "segorogoh",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 6,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen kerupuk lempeng, uga tepo tahu lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦝꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "kerupuklempeng",
      "tepotahu",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 7,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu sing disajikake nganggo kuah, uga bolu Magetan lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸꦱꦶꦁꦢꦶꦱꦗꦶꦏꦏꦺꦔꦁꦒꦺꦴꦏꦸꦮꦃ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦺꦠꦤ꧀ꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "bolumagetan",
      "kerupuklempeng"
    ]
  },
  {
    "id": 8,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh saka Desa Pacalan, Plaosan, uga jenang candi lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦱꦏꦢꦺꦱꦥꦕꦭꦤ꧀ ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "jenangcandi",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 9,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu saka Kampung Gandu, uga bolu Magetan lan sego rogoh. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸꦱꦏꦏꦩ꧀ꦥꦸꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "bolumagetan",
      "segorogoh"
    ]
  },
  {
    "id": 10,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi, uga tepo tahu lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "tepotahu",
      "kerupuklempeng"
    ]
  },
  {
    "id": 11,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen bolu Magetan sing kalebu panganan panggang, uga tepo tahu lan sego rogoh. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "bolumagetan",
      "tepotahu",
      "segorogoh"
    ]
  },
  {
    "id": 12,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen kerupuk lempeng sing kalebu panganan tradisional Magetan, uga jenang candi lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧈ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "kerupuklempeng",
      "jenangcandi",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 13,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu sing nganggo kuah legi, gurih, lan pedhes, uga ayam panggang Gandu lan bolu Magetan. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧈ꦲꦸꦒꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸꦭꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "ayampangangganggandu",
      "bolumagetan"
    ]
  },
  {
    "id": 14,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi saka Desa Candi, uga sego rogoh lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "segorogoh",
      "kerupuklempeng"
    ]
  },
  {
    "id": 15,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh sing disajikake nganggo kendil, uga tepo tahu lan bolu Magetan. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "tepotahu",
      "bolumagetan"
    ]
  },
  {
    "id": 16,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu sing misuwur saka Kampung Gandu, uga jenang candi lan sego rogoh. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "jenangcandi",
      "segorogoh"
    ]
  },
  {
    "id": 17,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen bolu Magetan, yaiku salah siji jajanan panggang, uga kerupuk lempeng lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧈ꦲꦸꦒꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "bolumagetan",
      "kerupuklempeng",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 18,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu lan sego rogoh sing kalebu panganan tradhisional, uga jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "segorogoh",
      "jenangcandi"
    ]
  },
  {
    "id": 19,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen kerupuk lempeng lan bolu Magetan kanggo oleh-oleh, uga tepo tahu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "kerupuklempeng",
      "bolumagetan",
      "tepotahu"
    ]
  },
  {
    "id": 20,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu sing dimasak kanthi cara dipanggang, uga kerupuk lempeng lan sego rogoh. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁꦭꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "kerupuklempeng",
      "segorogoh"
    ]
  },
  {
    "id": 21,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi sing ana gandhengane karo tradhisi mantenan ing Desa Candi, uga bolu Magetan lan tepo tahu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "bolumagetan",
      "tepotahu"
    ]
  },
  {
    "id": 22,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh saka Desa Pacalan, Plaosan, uga ayam panggang Gandu lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧈ꦲꦸꦒꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "ayampangangganggandu",
      "kerupuklempeng"
    ]
  },
  {
    "id": 23,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu sing nduweni rasa legi, gurih, lan pedhes, uga bolu Magetan lan jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "bolumagetan",
      "jenangcandi"
    ]
  },
  {
    "id": 24,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen kerupuk lempeng sing dadi kuliner tradisional daerah, uga sego rogoh lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "kerupuklempeng",
      "segorogoh",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 25,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen bolu Magetan sing awujud kue panggang, uga jenang candi lan sego rogoh. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧈ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "bolumagetan",
      "jenangcandi",
      "segorogoh"
    ]
  },
  {
    "id": 26,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu saka Karangrejo, uga tepo tahu lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "tepotahu",
      "kerupuklempeng"
    ]
  },
  {
    "id": 27,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi lan sego rogoh, uga bolu Magetan sing kalebu jajanan panggang. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "segorogoh",
      "bolumagetan"
    ]
  },
  {
    "id": 28,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu, yaiku panganan kanthi kuah legi, gurih, lan pedhes, uga sego rogoh lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "segorogoh",
      "kerupuklempeng"
    ]
  },
  {
    "id": 29,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu sing dipanggang nganggo kayu bakar, uga bolu Magetan lan jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "bolumagetan",
      "jenangcandi"
    ]
  },
  {
    "id": 30,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh sing disajikake ing kendil, uga tepo tahu lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "tepotahu",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 31,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen kerupuk lempeng, panganan tradisional Magetan, uga bolu Magetan lan jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "kerupuklempeng",
      "bolumagetan",
      "jenangcandi"
    ]
  },
  {
    "id": 32,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen bolu Magetan sing kalebu jajanan panggang, uga ayam panggang Gandu lan tepo tahu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧈ꦲꦸꦒꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸꦭꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "bolumagetan",
      "ayampangangganggandu",
      "tepotahu"
    ]
  },
  {
    "id": 33,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi sing gegayutan karo adat mantenan, uga kerupuk lempeng lan sego rogoh. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁꦭꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "kerupuklempeng",
      "segorogoh"
    ]
  },
  {
    "id": 34,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh saka wilayah Plaosan, uga bolu Magetan lan tepo tahu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "bolumagetan",
      "tepotahu"
    ]
  },
  {
    "id": 35,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu sing dadi kuliner saka Kampung Gandu, uga sego rogoh lan jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "segorogoh",
      "jenangcandi"
    ]
  },
  {
    "id": 36,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu lan bolu Magetan, uga kerupuk lempeng sing dadi salah siji panganan tradisional Magetan. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "bolumagetan",
      "kerupuklempeng"
    ]
  },
  {
    "id": 37,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi saka Desa Candi, uga ayam panggang Gandu lan tepo tahu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸꦭꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "ayampangangganggandu",
      "tepotahu"
    ]
  },
  {
    "id": 38,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh sing disajikake nganggo kendil, uga kerupuk lempeng lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧈ꦲꦸꦒꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "kerupuklempeng",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 39,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen bolu Magetan, salah siji jajanan panggang, uga jenang candi lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧈ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "bolumagetan",
      "jenangcandi",
      "kerupuklempeng"
    ]
  },
  {
    "id": 40,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu sing dipanggang nganggo kayu bakar, uga sego rogoh lan bolu Magetan. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "segorogoh",
      "bolumagetan"
    ]
  },
  {
    "id": 41,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu sing rasane legi, gurih, lan pedhes, uga jenang candi lan kerupuk lempeng. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧈ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "jenangcandi",
      "kerupuklempeng"
    ]
  },
  {
    "id": 42,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh saka Desa Pacalan, uga bolu Magetan lan jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "bolumagetan",
      "jenangcandi"
    ]
  },
  {
    "id": 43,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen kerupuk lempeng sing kalebu kuliner tradisional Magetan, uga ayam panggang Gandu lan tepo tahu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧈ꦲꦸꦒꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸꦭꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "kerupuklempeng",
      "ayampangangganggandu",
      "tepotahu"
    ]
  },
  {
    "id": 44,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi sing gegayutan karo tradhisi mantenan, uga sego rogoh lan bolu Magetan. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "segorogoh",
      "bolumagetan"
    ]
  },
  {
    "id": 45,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen ayam panggang Gandu saka Kampung Gandu, uga kerupuk lempeng lan jenang candi. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧈ꦲꦸꦒꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁꦭꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "ayampangangganggandu",
      "kerupuklempeng",
      "jenangcandi"
    ]
  },
  {
    "id": 46,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen bolu Magetan sing kalebu panganan panggang, uga tepo tahu lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧈ꦲꦸꦒꦠꦺꦥꦺꦴꦠꦲꦸꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "bolumagetan",
      "tepotahu",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 47,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen sego rogoh sing disajikake nganggo kendil, uga kerupuk lempeng lan tepo tahu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃ꧈ꦲꦸꦒꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁꦭꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "segorogoh",
      "kerupuklempeng",
      "tepotahu"
    ]
  },
  {
    "id": 48,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen jenang candi saka Desa Candi, uga bolu Magetan lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦗꦼꦤꦁꦕꦤ꧀ꦢꦶ꧈ꦲꦸꦒꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀ꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "jenangcandi",
      "bolumagetan",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 49,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradisional Magetan. Kowe arep pesen tepo tahu sing rasane legi, gurih, lan pedhes, uga sego rogoh lan ayam panggang Gandu. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦠꦺꦥꦺꦴꦠꦲꦸ꧈ꦲꦸꦒꦱꦼꦒꦺꦴꦫꦺꦴꦒꦺꦴꦃꦭꦤ꧀ꦲꦪꦩ꧀ꦥꦁꦒꦁꦒꦤ꧀ꦢꦸ꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "tepotahu",
      "segorogoh",
      "ayampangangganggandu"
    ]
  },
  {
    "id": 50,
    "latin": "Dina iki warungku nyedhiyakake maneka warna panganan tradhisional Magetan. Kowe arep pesen kerupuk lempeng sing dadi salah siji kuliner tradisional Magetan, uga jenang candi lan bolu Magetan. Sawise kuwi, pilih panganan sing cocog karo pesenanmu lan selehna ing nampan.",
    "aksara": "꧋ꦢꦶꦤꦲꦶꦏꦶꦮꦫꦸꦁꦏꦸꦚꦼꦣꦶꦪꦏꦏꦺꦩꦤꦺꦏꦮꦂꦤꦥꦔꦤꦤ꧀ꦠꦿꦣꦶꦱꦶꦪꦺꦴꦤꦭ꧀ꦩꦒꦼꦠꦤ꧀꧈ꦏꦺꦴꦮꦺꦲꦫꦼꦥ꧀ꦥꦼꦱꦼꦤ꧀ꦏꦼꦫꦸꦥꦸꦏ꧀ꦭꦼꦩ꧀ꦥꦼꦁ꧈ꦲꦸꦒꦗꦼꦤꦁꦕꦤ꧀ꦢꦶꦭꦤ꧀ꦧꦺꦴꦭꦸꦩꦒꦼꦠꦤ꧀꧉ꦱꦮꦶꦱꦺꦏꦸꦮꦶ꧈ꦥꦶꦭꦶꦃꦥꦔꦤꦤ꧀ꦱꦶꦁꦕꦺꦴꦕꦺꦴꦒ꧀ꦏꦫꦺꦴꦥꦼꦱꦼꦤꦤ꧀ꦩꦸꦭꦤ꧀ꦱꦺꦭꦺꦃꦤꦲꦶꦁꦤꦩ꧀ꦥꦤ꧀꧈",
    "targetFoodIds": [
      "kerupuklempeng",
      "jenangcandi",
      "bolumagetan"
    ]
  }
];
