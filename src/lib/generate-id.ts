import { customAlphabet } from 'nanoid';

const myid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

export function genId(prefix: string) {
	return `${prefix}_${myid()}`;
}
