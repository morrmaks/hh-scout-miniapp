import { apicraft } from '@siberiacancode/apicraft';

export default apicraft([
  {
    input:
      'https://raw.githubusercontent.com/morrmaks/hh-scout-miniapp/develop/backend/api/openapi.json',
    output: 'src/common/api/generated',
    instance: {
      name: 'fetches',
      runtimeInstancePath: 'src/common/api/client'
    },
    nameBy: 'path',
    groupBy: 'tags'
  }
]);
