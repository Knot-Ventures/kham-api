import { ObjectID } from 'bson';

export function safeObjectId(id: string): ObjectID | null {
	try {
		// console.log({ id });
		const _oid = new ObjectID(id);
		// console.log({ _oid });
		return _oid;
	} catch (e) {
		return null;
	}
}
