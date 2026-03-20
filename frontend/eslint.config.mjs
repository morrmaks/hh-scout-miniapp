import { eslint } from '@siberiacancode/eslint';

export default eslint({
  typescript: true,
  rules: {
    'e18e/prefer-spread-syntax': 'off',
    'e18e/prefer-array-to-sorted': 'off'
  },
  ignores: ['**/generated/**']
});
