import type { ArrowConfiguration } from './types';

const STORAGE_KEY = 'archery-friend-configs';

/**
 * Save arrow configurations to localStorage
 */
export function saveConfigurations(configs: ArrowConfiguration[]): void {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
		} catch (error) {
			console.error('Failed to save configurations:', error);
		}
	}
}

/**
 * Load arrow configurations from localStorage
 */
export function loadConfigurations(): ArrowConfiguration[] {
	if (typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error('Failed to load configurations:', error);
			return [];
		}
	}
	return [];
}

/**
 * Generate a unique ID for configurations
 */
export function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a default configuration
 */
export function createDefaultConfiguration(): Partial<ArrowConfiguration> {
	return {
		name: 'New Setup',
		drawLength: 28,
		drawWeight: 50,
		overhang: 1,
		pointWeight: 125,
		nockWeight: 8,
		fletchingWeight: 21,
		arrowMaterial: 'carbon',
		spineValue: 340,
		shaftWeight: 8.5,
		shaftName: 'Easton 4MM Full Metal Jacket 340'
	};
}
