import { getCurrencyRates } from '../../integrations/currency';
import { convertCurrency } from '../../utils/currency';
import { prisma } from '../prisma';

export async function recalcFavoriteSalaries() {
  const rates = await getCurrencyRates();

  const favorites = await prisma.favorite.findMany({
    where: {
      currency: { not: null },
      OR: [{ salaryFrom: { not: null } }, { salaryTo: { not: null } }]
    },
    select: {
      id: true,
      salaryFrom: true,
      salaryTo: true,
      currency: true,
      salaryBase: true
    }
  });

  const updates = favorites
    .map((f) => {
      const salary = f.salaryTo ?? f.salaryFrom;
      if (!salary || !f.currency) return null;

      const salaryBase = Math.round(convertCurrency(salary, f.currency, 'RUR', rates));

      if (salaryBase === f.salaryBase) return null;

      return prisma.favorite.update({
        where: { id: f.id },
        data: { salaryBase }
      });
    })
    .filter((u): u is ReturnType<typeof prisma.favorite.update> => u !== null);

  if (!updates.length) return;

  await prisma.$transaction(updates);
}
