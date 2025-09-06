/**
 * Slugify a string
 * @param text - The string to slugify
 * @returns The slugified string
 */
export const slugify = (text: string): string => {
  return text.toLowerCase().replace(/ /g, "-");
};
