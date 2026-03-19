import { prisma } from '@/db';

import { getCurrencyRates } from '../../integrations/currency';
import { convertCurrency } from '../../utils/currency';

const BATCH_SIZE = 100;

export async function recalcFavoriteSalaries() {
  const rates = await getCurrencyRates();

  let cursor: number | undefined;

  while (true) {
    const favorites = await prisma.favorite.findMany({
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
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
      },
      orderBy: { id: 'asc' }
    });

    if (!favorites.length) return;

    const updates = [];

    for (const f of favorites) {
      const salary = f.salaryTo ?? f.salaryFrom;
      if (!salary || !f.currency) continue;

      const salaryBase = Math.round(convertCurrency(salary, f.currency, 'RUR', rates));

      if (salaryBase === f.salaryBase) continue;

      updates.push(
        prisma.favorite.update({
          where: { id: f.id },
          data: { salaryBase }
        })
      );
    }

    if (updates.length) {
      await prisma.$transaction(updates);
    }

    cursor = favorites.at(-1)?.id;
  }
}
