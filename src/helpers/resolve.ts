export const resolve = async <T>(
	promise: PromiseLike<T>,
): Promise<[T | null, any]> => {
	try {
		const response = await promise;
		return [response, null];
	} catch (error) {
		return [null, error];
	}
};
