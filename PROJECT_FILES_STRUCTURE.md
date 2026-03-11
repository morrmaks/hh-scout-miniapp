# HH Scout MiniApp - Project Files Structure

## Root Level

### package.json
```json
```

### package-lock.json
```json
```

### .gitignore
```
```

## Backend

### backend/package.json
```json
```

### backend/package-lock.json
```json
```

### backend/.env
```
```

### backend/.gitignore
```
```

### backend/.prettierrc.js
```js
```

### backend/eslint.config.mjs
```js
```

### backend/tsconfig.json
```json
```

### backend/prisma/schema.prisma
```prisma
```

### backend/src/server.ts
```typescript
```

### backend/src/db/prisma.ts
```typescript
```

### backend/src/types/types.ts
```typescript
```

### backend/src/middleware/errorMiddleware.ts
```typescript
```

### backend/src/queue/queue.ts
```typescript
```

### backend/src/router/index.ts
```typescript
```

### backend/src/router/jobsRouter.ts
```typescript
```

### backend/src/router/areasRouter.ts
```typescript
```

### backend/src/router/favoritesRouter.ts
```typescript
```

### backend/src/services/jobsService.ts
```typescript
```

### backend/src/services/areasService.ts
```typescript
```

### backend/src/services/favoritesService.ts
```typescript
```

### backend/src/dto/jobDto.ts
```typescript
```

### backend/src/dto/jobPreviewDto.ts
```typescript
```

### backend/src/dto/favoriteJobDto.ts
```typescript
```

### backend/src/dto/searchResultDto.ts
```typescript
```

### backend/src/utils/buildHHUrl.ts
```typescript
```

### backend/src/utils/formatJobDate.ts
```typescript
```

### backend/src/utils/format.ts
```typescript
```

### backend/src/utils/mapNames.ts
```typescript
```

### backend/src/utils/flattenAreas.ts
```typescript
```

### backend/src/utils/buildSearchKey.ts
```typescript
```

### backend/src/utils/parseJobFilters.ts
```typescript
```

### backend/src/utils/fetchRetry.ts
```typescript
```

### backend/src/cache/jobsCache.ts
```typescript
```

### backend/src/cache/areasCache.ts
```typescript
```

### backend/src/cache/lru.ts
```typescript
```

## Frontend

### frontend/package.json
```json
```

### frontend/package-lock.json
```json
```

### frontend/.env
```
```

### frontend/.gitignore
```
```

### frontend/.prettierrc.js
```js
```

### frontend/eslint.config.mjs
```js
```

### frontend/tsconfig.json
```json
```

### frontend/tsconfig.app.json
```json
```

### frontend/tsconfig.node.json
```json
```

### frontend/vite.config.ts
```typescript
```

### frontend/apicraft.config.ts
```typescript
```

### frontend/index.html
```html
```

### frontend/README.md
```md
```

### frontend/src/main.ts
```typescript
```

### frontend/src/app.vue
```vue
```

### frontend/src/global/shims-vue.d.ts
```typescript
```

## Common Layer

### API Layer

#### frontend/src/common/api/generated/index.ts
```typescript
```

#### frontend/src/common/api/generated/types.gen.ts
```typescript
```

#### frontend/src/common/api/generated/requests/Jobs/getJobs.ts
```typescript
```

#### frontend/src/common/api/generated/requests/Jobs/getJobById.ts
```typescript
```

#### frontend/src/common/api/generated/requests/Jobs/searchJobs.ts
```typescript
```

#### frontend/src/common/api/generated/requests/Areas/getAreas.ts
```typescript
```

#### frontend/src/common/api/generated/requests/Favorites/getFavorites.ts
```typescript
```

#### frontend/src/common/api/generated/requests/Favorites/addFavorite.ts
```typescript
```

#### frontend/src/common/api/generated/requests/Favorites/removeFavorite.ts
```typescript
```

### UI Components

#### frontend/src/common/ui/Button.vue
```vue
```

#### frontend/src/common/ui/Input.vue
```vue
```

#### frontend/src/common/ui/Select.vue
```vue
```

#### frontend/src/common/ui/Checkbox.vue
```vue
```

#### frontend/src/common/ui/Badge.vue
```vue
```

#### frontend/src/common/ui/Spinner.vue
```vue
```

#### frontend/src/common/ui/Skeleton.vue
```vue
```

#### frontend/src/common/ui/Pagination.vue
```vue
```

#### frontend/src/common/ui/PaginationSkeleton.vue
```vue
```

#### frontend/src/common/ui/Drawer.vue
```vue
```

#### frontend/src/common/ui/FilterGroup.vue
```vue
```

#### frontend/src/common/ui/ToggleGroup.vue
```vue
```

#### frontend/src/common/ui/Scrubber.vue
```vue
```

#### frontend/src/common/ui/InputNumber.vue
```vue
```

### Utils

#### frontend/src/common/utils/format.ts
```typescript
```

#### frontend/src/common/utils/validation.ts
```typescript
```

#### frontend/src/common/utils/constants.ts
```typescript
```

### Lib

#### frontend/src/common/lib/api.ts
```typescript
```

## Modules Layer

### Jobs Module

#### frontend/src/modules/jobs/index.ts
```typescript
```

#### frontend/src/modules/jobs/types/types.ts
```typescript
```

#### frontend/src/modules/jobs/store/jobsStore.ts
```typescript
```

#### frontend/src/modules/jobs/composables/useJobs.ts
```typescript
```

#### frontend/src/modules/jobs/composables/useJobFilters.ts
```typescript
```

#### frontend/src/modules/jobs/composables/useJobSearch.ts
```typescript
```

#### frontend/src/modules/jobs/utils/formatJob.ts
```typescript
```

#### frontend/src/modules/jobs/lib/config.ts
```typescript
```

#### frontend/src/modules/jobs/lib/constants.ts
```typescript
```

#### frontend/src/modules/jobs/ui/JobCard.vue
```vue
```

#### frontend/src/modules/jobs/ui/JobList.vue
```vue
```

#### frontend/src/modules/jobs/ui/JobFilters.vue
```vue
```

#### frontend/src/modules/jobs/ui/JobSearch.vue
```vue
```

#### frontend/src/modules/jobs/ui/JobDetail.vue
```vue
```

#### frontend/src/modules/jobs/ui/JobSkeleton.vue
```vue
```

#### frontend/src/modules/jobs/ui/JobPagination.vue
```vue
```

#### frontend/src/modules/jobs/ui/JobEmpty.vue
```vue
```

### Areas Module

#### frontend/src/modules/areas/index.ts
```typescript
```

#### frontend/src/modules/areas/types/types.ts
```typescript
```

#### frontend/src/modules/areas/ui/AreaSelect.vue
```vue
```

## Pages Layer

### frontend/src/pages/index.vue
```vue
```

### frontend/src/pages/favorites/index.vue
```vue
```

### frontend/src/pages/job/[id].vue
```vue
```

## Configuration Files

### .husky/pre-commit
```
```