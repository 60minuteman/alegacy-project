export function generateSessionId(): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `10000${timestamp}${randomNum}`;
}
