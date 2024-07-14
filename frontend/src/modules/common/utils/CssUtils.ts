export const baseFontSizeInEm = 1; // 16px = 1em

export const smallFontSizeInEm = 0.875; // 14px = 0.875em

/**
 * Convert pixels to ems
 * @param px 
 * @param baseFontSizeInPx 
 * @returns 
 */
export const pxToEm = (px: number, baseFontSizeInPx: number = 16) => px / baseFontSizeInPx;

/**
 * Convert ems to pixels
 * @param em 
 * @param baseFontSizeInPx 
 * @returns 
 */
export const emToPx = (em: number, baseFontSizeInPx: number = 16) => em * baseFontSizeInPx;
