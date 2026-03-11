# HH Scout MiniApp - Полная документация проекта

## Обзор проекта

**HH Scout MiniApp** - это веб-приложение для поиска и анализа вакансий с HeadHunter (hh.ru), построенное по архитектуре фронтенд-бэкенд с использованием современных технологий.

### Основные характеристики
- **Тип**: Монолитное приложение с разделенным фронтендом и бэкендом
- **Цель**: Поиск, фильтрация и сохранение вакансий с hh.ru
- **Архитектура**: FEOD на фронтенде
- **Платформа**: Telegram MiniApp с интеграцией TWA SDK

## Стек технологий

### Frontend
- **Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Routing**: Vue Router 5
- **HTTP Client**: @siberiacancode/fetches
- **UI**: Custom компоненты с Lucide icons
- **Code Generation**: @siberiacancode/apicraft (OpenAPI)
- **Composition Utilities**: @vueuse/core для реактивной логики
- **Linting**: ESLint + Prettier
- **Telegram Integration**: @twa-dev/sdk

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL с Prisma ORM
- **External API**: HeadHunter API
- **File Processing**: XLSX для экспорта
- **Security**: CORS, HTML санитизация (he)

### DevOps
- **Package Manager**: npm workspaces
- **Code Quality**: Husky + lint-staged
- **Environment**: Development/Production конфигурации

## Архитектура проекта

### Общая структура
```
hh-scout-miniapp/
├── frontend/          # Vue.js приложение
├── backend/           # Express.js API
├── package.json       # Root workspace конфигурация
└── .gitignore         # Общие игноры
```

### Frontend архитектура (Feature-Sliced Design)

```
frontend/src/
├── app/              # App слой (конфигурация приложения)
│   ├── App.vue       # Корневой компонент
│   ├── main.ts       # Точка входа
│   ├── providers/    # Провайдеры (Pinia)
│   ├── router/       # Vue Router конфигурация
│   ├── styles/       # Глобальные стили
│   └── http/         # HTTP клиент конфигурация
├── pages/            # Pages слой (страницы)
│   └── index.vue     # Главная страница поиска
├── modules/          # Modules слой (бизнес-фичи)
│   ├── jobs/         # Модуль поиска вакансий
│   ├── areas/        # Модуль регионов
│   └── favorites/    # Модуль избранного
├── common/           # Common слой (общий код)
│   ├── api/          # API клиенты (сгенерированы)
│   ├── ui/           # UI компоненты
│   ├── utils/        # Утилиты
│   └── lib/          # Библиотеки
└── global/           # Global слой (глобальные типы)
```

### Backend архитектура

```
backend/src/
├── server.ts         # Точка входа Express сервера
├── router/           # Express роутеры
│   ├── jobsRouter.ts # API вакансий
│   ├── favoritesRouter.ts # API избранного
│   └── areasRouter.ts # API регионов
├── services/         # Бизнес-логика
│   ├── jobsService.ts # Сервис вакансий
│   ├── favoritesService.ts # Сервис избранного
│   └── hhApiService.ts # HH API интеграция
├── cache/            # Система кеширования
│   ├── jobsCache.ts  # Кеш вакансий
│   ├── areasCache.ts # Кеш регионов
│   └── lru.ts        # LRU кеш реализация
├── dto/              # Data Transfer Objects
├── middleware/       # Express middleware
├── queue/            # Очередь запросов
├── utils/            # Утилиты
└── types/            # TypeScript типы
```

## Основные модули и их взаимодействие

### 1. Модуль поиска вакансий (Jobs)

**Frontend:**
- **Store**: `jobs.store.ts` - Pinia store с состоянием поиска
- **Composables**: 
  - `useJobsPosition.ts` - управление позицией в списке
  - `useViewedJobs.ts` - отслеживание просмотренных
  - `useSearchHistory.ts` - история поиска
- **VueUse Utilities**: использование @vueuse/core для реактивной логики
- **UI Components**: 
  - `JobsSearch.vue` - форма поиска
  - `JobViewer.vue` - просмотр вакансии
  - `JobsFiltersDrawer.vue` - фильтры
  - `JobsPagination.vue` - пагинация

**Backend:**
- **Router**: `/jobs` эндпоинты
- **Service**: `jobsService.ts` - основная логика поиска
- **Cache**: многоуровневое кеширование сессий и вакансий

### 2. Модуль регионов (Areas)

**Frontend:**
- **Store**: `areas.store.ts` - управление регионами
- **UI**: `AreasSelect.vue` - выбор регионов

**Backend:**
- **Router**: `/areas` эндпоинт
- **Cache**: `areasCache.ts` - кеш регионов

### 3. Модуль избранного (Favorites)

**Frontend:**
- **Store**: `favorites.store.ts` - управление избранным
- **UI**: компоненты для работы с избранным

**Backend:**
- **Router**: `/favorites` эндпоинты
- **Service**: `favoritesService.ts` - логика избранного
- **Database**: PostgreSQL через Prisma

## Взаимодействие компонентов

### Поток данных поиска вакансий

1. **Пользовательский ввод** → `JobsSearch.vue`
2. **Валидация и фильтры** → `jobs.store.ts`
3. **API запрос** → `getJobs()` (сгенерированный API клиент)
4. **Бэкенд обработка** → `jobsRouter.ts` → `jobsService.ts`
5. **Кеширование** → `jobsCache.ts`
6. **HH API запрос** → Внешний API hh.ru
7. **Обработка ответа** → DTO трансформация
8. **Фронтенд обновление** → Pinia store реактивность
9. **UI рендер** → `JobViewer.vue` + пагинация

### Система кеширования

**Трехуровневое кеширование:**
1. **Search Sessions** - кеш поисковых сессий
2. **Vacancy Cache** - кеш детальной информации о вакансиях
3. **Areas Cache** - кеш регионов

**LRU Cache:**
- Собственная реализация LRU кеша
- Автоматическая очистка каждые 24 часа
- Ограничение размера для предотвращения memory leaks

### Prefetch механизм

**Опережающая загрузка:**
- Триггер: при достижении 7 из 10 элементов
- Загрузка следующей порции вакансий
- Бесшовная навигация между вакансиями

## API архитектура

### Frontend API (сгенерирован через @siberiacancode/apicraft)

**Конфигурация API Craft:**
```typescript
// apicraft.config.ts
import { apicraft } from '@siberiacancode/apicraft';

export default apicraft([
  {
    input: 'https://raw.githubusercontent.com/morrmaks/hh-scout-miniapp/develop/backend/api/openapi.json',
    output: 'src/common/api/generated',
    instance: {
      name: 'fetches',
      runtimeInstancePath: 'src/app/http/client'
    },
    nameBy: 'path',
    groupBy: 'tags'
  }
]);
```

**Сгенерированные клиенты:**
```typescript
// src/common/api/generated/index.ts
export * from './types.gen';
export * from './requests/Jobs/getJobs.gen';
export * from './requests/Jobs/getJobsPrefetch.gen';
export * from './requests/Jobs/getJobById.gen';
export * from './requests/Areas/getAreas.gen';
export * from './requests/Favorites/postFavorites.gen';
export * from './requests/Favorites/getFavoriteByUserId.gen';
export * from './requests/Favorites/deleteFavoriteByUserIdByJobId.gen';
```

**HTTP Client конфигурация:**
```typescript
// src/app/http/client.ts
import { createFetches } from '@siberiacancode/fetches';

export const client = createFetches({
  baseURL: 'http://localhost:3000',
  // Дополнительная конфигурация fetches
});
```

### Backend API эндпоинты

```
GET  /jobs              # Поиск вакансий
GET  /jobs/prefetch     # Prefetch вакансий
GET  /jobs/:id          # Детальная информация
GET  /areas             # Список регионов
GET  /favorites/:userId # Избранное пользователя
POST /favorites         # Добавить в избранное
DELETE /favorites/:userId/:jobId # Удалить из избранного
GET  /favorites/export/:userId # Экспорт в Excel
```

## База данных

### Prisma Schema
```prisma
model Favorite {
  id        Int     @id @default(autoincrement())
  userId    Int
  jobId     String
  title     String
  company   String
  url       String
  salaryFrom Int?
  salaryTo   Int?
  currency   String?
  experience String?
  
  @@unique([userId, jobId])
}
```

**Характеристики:**
- PostgreSQL
- Уникальность по паре [userId, jobId]
- Опциональные поля для зарплаты и опыта

## Конфигурация и окружение

### Frontend конфигурация
- **Vite**: сборка и dev сервер
- **TypeScript**: строгая типизация
- **Path aliases**: `@` → `src/`
- **API Generation**: автоматическая генерация из OpenAPI спецификации через @siberiacancode/apicraft

### Backend конфигурация
- **Express**: CORS, JSON middleware
- **Environment**: DATABASE_URL из .env
- **Cleanup**: автоматическая очистка кеша каждые 24 часа

## Особенности реализации

### Telegram MiniApp интеграция
- Использование `@twa-dev/sdk`
- Адаптация UI для мобильных устройств
- Оптимизация производительности

### Оптимизация производительности
- **Prefetch**: опережающая загрузка контента
- **Cache**: многоуровневое кеширование
- **Lazy loading**: динамическая подгрузка компонентов
- **Virtual scrolling**: эффективная работа с большими списками

### User Experience
- **Сохранение позиции**: восстановление позиции в списке
- **История поиска**: быстрый доступ к предыдущим запросам
- **Просмотренные вакансии**: визуальная индикация
- **Бесшовная навигация**: мгновенная переключение между вакансиями

## Разработка и развертывание

### Scripts
```json
{
  "prepare": "husky",
  "lint": "npm run lint -w frontend && npm run lint -w backend",
  "lint:fix": "npm run lint:fix -w frontend && npm run lint:fix -w backend",
  "format": "npm run format -w frontend && npm run format -w backend"
}
```

### Frontend Scripts
```json
{
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "lint:fix": "eslint --fix",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit",
  "api:generate": "apicraft generate"
}
```

### Backend Scripts
```json
{
  "dev": "NODE_ENV=development tsx src/server.ts",
  "start": "NODE_ENV=production node dist/server.js",
  "prisma": "prisma",
  "prisma:generate": "prisma generate",
  "db": "prisma migrate dev",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write ."
}
```

### Workflows
- **Pre-commit hooks**: автоматический линтинг и форматирование
- **API generation**: автоматическая генерация типов из OpenAPI через `npm run api:generate`
- **Database migrations**: Prisma migrate dev

### Запуск проекта
```bash
# Установка зависимостей
npm install

# Frontend разработка
cd frontend && npm run dev

# Backend разработка  
cd backend && npm run dev

# Генерация API клиентов
cd frontend && npm run api:generate

# Линтинг всего проекта
npm run lint
```

## Ключевые зависимости

### Frontend Dependencies
```json
{
  "@siberiacancode/fetches": "^1.14.1",
  "@twa-dev/sdk": "^8.0.2",
  "@vueuse/core": "^14.2.1",
  "lucide-vue-next": "^0.577.0",
  "pinia": "^3.0.4",
  "vue": "^3.5.25",
  "vue-router": "^5.0.3"
}
```

### Backend Dependencies
```json
{
  "@prisma/client": "^5.0.0",
  "cors": "^2.8.5",
  "express": "^4.19.0",
  "he": "^1.2.0",
  "xlsx": "^0.18.5"
}
```