import type { Prisma } from '@prisma/client';

export function pushAnd(where: Prisma.FavoriteWhereInput, condition: Prisma.FavoriteWhereInput) {
  if (!where.AND) {
    where.AND = [condition];
    return;
  }

  if (Array.isArray(where.AND)) {
    where.AND.push(condition);
    return;
  }

  where.AND = [where.AND, condition];
}
