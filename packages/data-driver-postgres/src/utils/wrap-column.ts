import { escapeIdentifier } from './escape-identifier.js';

/**
 * Gets a primitive field value.
 * @param table
 * @param column
 * @param as
 * @returns the selection for the primitive field
 */
export function wrapColumn(table: string, column: string, as: string | undefined): string {
	let base = `${escapeIdentifier(table)}.${escapeIdentifier(column)}`;

	if (as) {
		base += ` AS ${escapeIdentifier(as)}`;
	}

	return base;
}
