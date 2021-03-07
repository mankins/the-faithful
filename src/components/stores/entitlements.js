import { writable } from 'svelte/store';

import { baseProducts } from '$components/utils/auth.js';

export const page = writable({});

export const userEntitlements = writable([...baseProducts]);
