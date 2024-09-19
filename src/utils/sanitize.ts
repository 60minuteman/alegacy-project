export function sanitizeString(input: string | number | null | undefined): string {
  if (input === null || input === undefined) {
    return '';
  }
  
  const stringInput = String(input);
  
  // Remove all non-ASCII characters and control characters
  return stringInput.replace(/[^\x20-\x7E]/g, '')
                    .trim();
}
