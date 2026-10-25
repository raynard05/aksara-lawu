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
export const COMPLETED_LEVELS_KEY = "aksara_lawu_completed_levels";
export const USED_ITEMS_KEY = "aksara_lawu_used_items";

// Default unlocked levels: level 1 (id 2) selalu terbuka diawal
export const DEFAULT_UNLOCKED_LEVELS = [1]; // [1] artinya Level 1 terbuka. Level 2, 3, 4, 5 (ending) terkunci gembok.

/**
 * Mengambil daftar ID item yang sudah pernah digunakan pemain
 * Format: ["cardlevel2", ...]
 */
export function getUsedItems(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      sessionStorage.getItem(USED_ITEMS_KEY) ||
      localStorage.getItem(USED_ITEMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Menandai item tertentu telah berhasil digunakan pemain
 */
export function markItemUsed(itemId: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getUsedItems();
    if (!current.includes(itemId)) {
      const next = [...current, itemId];
      const jsonStr = JSON.stringify(next);
      sessionStorage.setItem(USED_ITEMS_KEY, jsonStr);
      localStorage.setItem(USED_ITEMS_KEY, jsonStr);
      window.dispatchEvent(
        new CustomEvent("aksara-lawu-used-items-change", {
          detail: { usedItems: next },
        })
      );
    }
  } catch (err) {
    console.error("Gagal nyimpen used items:", err);
  }
}

/**
 * Mengambil daftar level/pos yang sudah berhasil dituntaskan pemain
 * Format: [0, 1, ...] (0 = Cemoro Sewu, 1 = Pos 1, dst.)
 */
export function getCompletedLevels(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      sessionStorage.getItem(COMPLETED_LEVELS_KEY) ||
      localStorage.getItem(COMPLETED_LEVELS_KEY);
    if (!raw) {
      // Default: jika cemorosewu_completed = true, level 0 otomatis sudah tuntas
      const isCemoroDone =
        sessionStorage.getItem("aksara_lawu_cemorosewu_completed") === "true" ||
        localStorage.getItem("aksara_lawu_cemorosewu_completed") === "true";
      return isCemoroDone ? [0] : [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Menandai level/pos telah selesai dituntaskan pemain
 */
export function markLevelCompleted(levelNumber: number) {
  if (typeof window === "undefined") return;
  try {
    const current = getCompletedLevels();
    if (!current.includes(levelNumber)) {
      const next = [...current, levelNumber];
      const jsonStr = JSON.stringify(next);
      sessionStorage.setItem(COMPLETED_LEVELS_KEY, jsonStr);
      localStorage.setItem(COMPLETED_LEVELS_KEY, jsonStr);
      window.dispatchEvent(
        new CustomEvent("aksara-lawu-completed-levels-change", {
          detail: { completedLevels: next },
        })
      );
    }
  } catch (err) {
    console.error("Gagal nyimpen completed level:", err);
  }
}

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
 * - Level yang sudah dituntaskan
 */
export function resetGameProgress() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem("aksara_lawu_current_session");
    sessionStorage.removeItem("aksara_lawu_cemorosewu_completed");
    sessionStorage.removeItem("aksara_lawu_selected_avatar");
    sessionStorage.removeItem(INVENTORY_STORAGE_KEY);
    sessionStorage.removeItem(UNLOCKED_LEVELS_KEY);
    sessionStorage.removeItem(COMPLETED_LEVELS_KEY);
    sessionStorage.removeItem(USED_ITEMS_KEY);

    localStorage.removeItem("aksara_lawu_cemorosewu_completed");
    localStorage.removeItem("aksara_lawu_selected_avatar");
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
    localStorage.removeItem(UNLOCKED_LEVELS_KEY);
    localStorage.removeItem(COMPLETED_LEVELS_KEY);
    localStorage.removeItem(USED_ITEMS_KEY);

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
    window.dispatchEvent(
      new CustomEvent("aksara-lawu-completed-levels-change", {
        detail: { completedLevels: [] },
      })
    );
    window.dispatchEvent(
      new CustomEvent("aksara-lawu-used-items-change", {
        detail: { usedItems: [] },
      })
    );
  } catch (err) {
    console.error("Gagal reset progress game:", err);
  }
}
