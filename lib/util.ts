export interface CachedFn<K, T extends (...args: any[]) => any> {
	(...args: Parameters<T>): ReturnType<T>
	clear: () => void
	delete: (key: K) => boolean
}
export function cached<K, T extends (key: K, ...args: any[]) => any>(
	fn: T
): CachedFn<K, T> {
	const cache = new Map()

	function cachedFn(key: K, ...args: any[]) {
		if (cache.has(key)) return cache.get(key)
		const value = fn(key, ...args)
		cache.set(key, value)
		return value
	}

	cachedFn.clear = () => cache.clear()
	cachedFn.delete = (key: K) => cache.delete(key)

	return cachedFn
}
