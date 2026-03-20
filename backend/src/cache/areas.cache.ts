import type { FlatArea } from '../utils/flattenAreas';

import { LRU } from './lru';

export const areasCache = new LRU<string, FlatArea[]>(1, 24 * 60 * 60 * 1000);
