export function safeParseJson(json, returned: any = undefined) {
	return parseJsonOr(json, returned);
}

export function parseJsonOr(json: any, returned: any) {
	try {
		if (json && typeof json === 'string') {
			const object = JSON.parse(json);
			return object;
		} else {
			throw new Error();
		}
	} catch (e) {
		return returned;
	}
}

export function parseJsonOrUndefined(json: any) {
	return parseJsonOr(json, undefined);
}

export function parseJsonOrNull(json: any) {
	return parseJsonOr(json, null);
}

export function safeParseFloat(text, returned = -1) {
	try {
		if (text && typeof text === 'string') {
			return parseFloat(text);
		} else {
			throw new Error();
		}
	} catch (e) {
		return returned;
	}
}
