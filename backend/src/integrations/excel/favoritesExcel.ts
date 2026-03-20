import type { Favorite, Status } from '@prisma/client';

import ExcelJS from 'exceljs';
import { Buffer } from 'node:buffer';

import { STATUS_COLOR_MAP } from './statusColors';

const toExcelColor = (hex: string) => `FF${hex.replace('#', '').toUpperCase()}`;

const normalizeExperience = (exp: string | null) => {
  if (!exp) return null;

  switch (exp) {
    case 'Нет опыта':
      return '0';
    case 'От 1 года до 3 лет':
      return '1-3';
    case 'От 3 до 6 лет':
      return '3-6';
    case 'Более 6 лет':
      return '6';
    default:
      return exp;
  }
};

type FavoriteWithStatus = Favorite & { status: Status | null };

export async function generateFavoritesExcel(favorites: FavoriteWithStatus[], statuses: Status[]) {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('Вакансии');
  const statusSheet = workbook.addWorksheet('Статусы');

  sheet.views = [{ showGridLines: false }];

  /* ---------- СТАТУСЫ ---------- */

  statuses.forEach((s, i) => {
    statusSheet.getCell(`C${i + 1}`).value = s.name;
  });

  statusSheet.state = 'hidden';

  const statusRange = `Статусы!$C$1:$C$${statuses.length}`;

  /* ---------- ТАБЛИЦА ---------- */

  sheet.columns = [
    { header: 'Название', key: 'title', width: 42 },
    { header: 'Компания', key: 'company', width: 26 },
    { header: 'Зарплата от', key: 'salaryFrom', width: 14 },
    { header: 'Зарплата до', key: 'salaryTo', width: 14 },
    { header: 'Валюта', key: 'currency', width: 10 },
    { header: 'Опыт', key: 'experience', width: 16 },
    { header: 'Статус', key: 'status', width: 22 },
    { header: 'Ссылка', key: 'url', width: 14 }
  ];

  sheet.spliceColumns(1, 0, [], []);

  favorites.forEach((job) => {
    const row = sheet.addRow({
      title: job.title,
      company: job.company,
      salaryFrom: job.salaryFrom ?? 0,
      salaryTo: job.salaryTo,
      currency: job.currency,
      experience: normalizeExperience(job.experience),
      status: job.status?.name ?? ''
    });

    const salaryFromCell = row.getCell(5);
    const salaryToCell = row.getCell(6);
    const urlCell = row.getCell(10);

    urlCell.value = {
      text: 'Открыть',
      hyperlink: job.url
    };

    urlCell.font = {
      color: { argb: 'FF2563EB' },
      underline: true
    };

    salaryFromCell.numFmt = '#,##0';
    salaryToCell.alignment = { horizontal: 'left' };
    salaryToCell.numFmt = '#,##0';
    urlCell.alignment = { horizontal: 'center' };

    const statusCell = row.getCell(9);

    statusCell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [statusRange]
    };
  });

  const header = sheet.getRow(1);

  header.height = 28;

  header.font = {
    bold: true,
    size: 12,
    color: { argb: 'FFFFFFFF' }
  };

  header.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF111827' }
  };

  header.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  sheet.autoFilter = {
    from: 'C1',
    to: 'J1'
  };

  const lastRow = sheet.rowCount;

  /* ---------- РАМКА ---------- */

  for (let r = 1; r <= lastRow; r++) {
    for (let c = 3; c <= 10; c++) {
      const cell = sheet.getCell(r, c);

      const border: any = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      if (r === 1) border.top = { style: 'medium' };
      if (r === lastRow) border.bottom = { style: 'medium' };
      if (c === 3) border.left = { style: 'medium' };
      if (c === 10) border.right = { style: 'medium' };

      cell.border = border;
    }
  }

  /* ---------- ЦВЕТНЫЕ СТАТУСЫ ---------- */

  statuses.forEach((status, i) => {
    const color = toExcelColor(
      STATUS_COLOR_MAP[status.color as keyof typeof STATUS_COLOR_MAP] ?? '#6b7280'
    );

    sheet.addConditionalFormatting({
      ref: `I2:I${lastRow}`,
      rules: [
        {
          type: 'expression',
          priority: i + 1,
          formulae: [`$I2="${status.name}"`],
          style: {
            fill: {
              type: 'pattern',
              pattern: 'solid',
              bgColor: { argb: color }
            },
            font: {
              color: { argb: 'FFFFFFFF' },
              bold: true
            }
          }
        }
      ]
    });
  });

  /* ---------- DASHBOARD (под таблицей) ---------- */

  const dashStart = lastRow + 3;
  const dashEnd = dashStart + 2 + statuses.length;

  sheet.mergeCells(`C${dashStart}:D${dashStart}`);

  const headerCell = sheet.getCell(`C${dashStart}`);

  headerCell.value = 'Дашборд вакансий';

  headerCell.font = {
    size: 16,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };

  headerCell.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  headerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2E74BD' }
  };

  sheet.getRow(dashStart).height = 30;

  /* ВСЕГО ВАКАНСИЙ */

  const totalRow = dashStart + 1;

  sheet.getCell(`C${totalRow}`).value = 'Всего вакансий';

  const totalTitle = sheet.getCell(`C${totalRow}`);
  const totalValue = sheet.getCell(`D${totalRow}`);

  totalTitle.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF3A8DE2' }
  };

  totalTitle.font = {
    color: { argb: 'FFFFFFFF' },
    bold: true
  };

  totalValue.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF3AA4E1' }
  };

  totalValue.font = {
    color: { argb: 'FFFFFFFF' },
    bold: true
  };

  totalValue.value = {
    formula: `COUNTA(C2:C${lastRow})`
  };

  totalValue.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  /* СТАТУСЫ */

  statuses.forEach((status, i) => {
    const row = dashStart + 3 + i;

    const titleCell = sheet.getCell(`C${row}`);
    const valueCell = sheet.getCell(`D${row}`);

    titleCell.value = status.name;

    valueCell.value = {
      formula: `COUNTIF(I2:I${lastRow},"${status.name}")`
    };

    const color = toExcelColor(
      STATUS_COLOR_MAP[status.color as keyof typeof STATUS_COLOR_MAP] ?? '#6b7280'
    );

    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };

    titleCell.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true
    };

    valueCell.alignment = {
      horizontal: 'center'
    };

    valueCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3AA4E1' }
    };

    valueCell.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true
    };

    titleCell.border = {
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } }
    };

    valueCell.border = {
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } }
    };
  });

  /* ЖИРНАЯ РАМКА ВОКРУГ DASHBOARD */

  for (let r = dashStart; r <= dashEnd; r++) {
    const left = sheet.getCell(`C${r}`);
    const right = sheet.getCell(`D${r}`);

    const color = { argb: 'FF000000' };

    left.border = {
      ...left.border,
      left: { style: 'medium', color }
    };

    right.border = {
      ...right.border,
      right: { style: 'medium', color }
    };

    if (r === dashStart) {
      left.border = { ...left.border, top: { style: 'medium', color } };
      right.border = { ...right.border, top: { style: 'medium', color } };
    }

    if (r === dashEnd) {
      left.border = { ...left.border, bottom: { style: 'medium', color } };
      right.border = { ...right.border, bottom: { style: 'medium', color } };
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return Buffer.from(buffer);
}
