export function formatJobDate(date: string) {
  const d = new Date(date);

  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
}
