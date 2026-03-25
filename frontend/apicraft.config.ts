import { apicraft } from '@siberiacancode/apicraft';

export default apicraft([
  {
    input:
      'https://gist.githubusercontent.com/morrmaks/c7415f4f62decd6def56f8679075f4ee/raw/openapi.json',
    output: 'src/common/api/generated',
    instance: {
      name: 'fetches',
      runtimeInstancePath: 'src/common/api/client'
    },
    nameBy: 'path',
    groupBy: 'tags'
  }
]);
