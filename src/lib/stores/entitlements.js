import { writable } from 'svelte/store';

import { baseProducts } from '$lib/utils/auth.js';

export const userEntitlements = writable([...baseProducts]);
