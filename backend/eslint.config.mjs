import { eslint } from '@siberiacancode/eslint';

export default eslint({
  typescript: true,
  rules: {
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/buffer': ['error', 'always']
  }
});
