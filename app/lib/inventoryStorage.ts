export interface InventoryItemData {
  id: string;
  name: string;
  type: "card" | "item";
  targetLevel: number | null;
  unlockLevelNumber: number | null;
  passcode: string | null;
  image: string;
  description: string;
}

export const INVENTORY_STORAGE_KEY = "aksara_lawu_inventory_items";
export const UNLOCKED_LEVELS_KEY = "aksara_lawu_unlocked_levels";

// Default unlocked levels: level 1 (id 2) selalu terbuka diawal
export const DEFAULT_UNLOCKED_LEVELS = [1]; // [1] artinya Level 1 terbuka. Level 2, 3, 4, 5 (ending) terkunci gembok.

/**
 * Mengambil daftar item inventory yang dimiliki pemain
 */
export function getSavedInventoryItems(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      sessionStorage.getItem(INVENTORY_STORAGE_KEY) ||
      localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) {
      // Default inventory kosong sesuai permintaan user
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Menyimpan daftar item inventory yang dimiliki pemain
 */
export function saveInventoryItems(itemIds: string[]) {
  if (typeof window === "undefined") return;
  try {
    const jsonStr = JSON.stringify(itemIds);
    sessionStorage.setItem(INVENTORY_STORAGE_KEY, jsonStr);
    localStorage.setItem(INVENTORY_STORAGE_KEY, jsonStr);
    window.dispatchEvent(
      new CustomEvent("aksara-lawu-inventory-change", {
        detail: { items: itemIds },
      })
    );
  } catch (err) {
    console.error("Gagal nyimpen inventory:", err);
  }
}

/**
 * Mengambil daftar level yang sudah terbuka gemboknya
 * Format array: [1, 2, ...]
 */
export function getUnlockedLevels(): number[] {
  if (typeof window === "undefined") return DEFAULT_UNLOCKED_LEVELS;
  try {
    const raw =
      sessionStorage.getItem(UNLOCKED_LEVELS_KEY) ||
      localStorage.getItem(UNLOCKED_LEVELS_KEY);
    if (!raw) return DEFAULT_UNLOCKED_LEVELS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_UNLOCKED_LEVELS;
  } catch {
    return DEFAULT_UNLOCKED_LEVELS;
  }
}

/**
 * Membuka kunci level baru (save session & local storage)
 */
export function unlockLevel(levelNumber: number) {
  if (typeof window === "undefined") return;
  try {
    const current = getUnlockedLevels();
    if (!current.includes(levelNumber)) {
      const next = [...current, levelNumber];
      const jsonStr = JSON.stringify(next);
      sessionStorage.setItem(UNLOCKED_LEVELS_KEY, jsonStr);
      localStorage.setItem(UNLOCKED_LEVELS_KEY, jsonStr);
      window.dispatchEvent(
        new CustomEvent("aksara-lawu-levels-change", {
          detail: { unlockedLevels: next },
        })
      );
    }
  } catch (err) {
    console.error("Gagal nyimpen level unlock:", err);
  }
}

/**
 * Mereset seluruh sesi permainan:
 * - Progress gembok / level di peta (kembali ke level 1)
 * - Item di inventory (kembali kosong)
 * - Avatar terpilih & status completion cemorosewu
 */
export function resetGameProgress() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem("aksara_lawu_current_session");
    sessionStorage.removeItem("aksara_lawu_cemorosewu_completed");
    sessionStorage.removeItem("aksara_lawu_selected_avatar");
    sessionStorage.removeItem(INVENTORY_STORAGE_KEY);
    sessionStorage.removeItem(UNLOCKED_LEVELS_KEY);

    localStorage.removeItem("aksara_lawu_cemorosewu_completed");
    localStorage.removeItem("aksara_lawu_selected_avatar");
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
    localStorage.removeItem(UNLOCKED_LEVELS_KEY);

    // Dispatch event agar seluruh listener aktif otomatis ter-reset
    window.dispatchEvent(
      new CustomEvent("aksara-lawu-inventory-change", {
        detail: { items: [] },
      })
    );
    window.dispatchEvent(
      new CustomEvent("aksara-lawu-levels-change", {
        detail: { unlockedLevels: DEFAULT_UNLOCKED_LEVELS },
      })
    );
  } catch (err) {
    console.error("Gagal reset progress game:", err);
  }
}
