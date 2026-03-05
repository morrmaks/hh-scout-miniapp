import { apicraft } from '@siberiacancode/apicraft';

export default apicraft([
  {
    input:
      'https://raw.githubusercontent.com/morrmaks/hh-scout-miniapp/main/backend/api/openapi.yaml',
    output: 'src/common/api/generated',
    instance: {
      name: 'fetches',
      runtimeInstancePath: '@src/common/api/client/http'
    },
    nameBy: 'path',
    groupBy: 'tags'
  }
]);
