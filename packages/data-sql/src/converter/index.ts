import type { AbstractQuery } from '@directus/data';
import type { AbstractSqlQuery } from '../types.js';
import { convertPrimitive } from './convert-primitive.js';
import { parameterIndexGenerator } from '../utils/param-index-generator.js';
import { convertSort } from './convert-sort.js';

/**
 * @param abstractQuery the abstract query to convert
 * @returns a format very close to actual SQL but without making assumptions about the actual SQL dialect
 */
export const convertAbstractQueryToAbstractSqlQuery = (abstractQuery: AbstractQuery): AbstractSqlQuery => {
	const statement: AbstractSqlQuery = {
		select: abstractQuery.nodes.map((abstractNode) => {
			switch (abstractNode.type) {
				case 'primitive':
					return convertPrimitive(abstractNode, abstractQuery.collection);
				case 'fn':
				case 'm2o':
				case 'o2m':
				case 'a2o':
				case 'o2a':
				default:
					throw new Error(`Type ${abstractNode.type} hasn't been implemented yet`);
			}
		}),
		from: abstractQuery.collection,
		parameters: [],
	};

	const idGen = parameterIndexGenerator();

	// TODO: Create a generic function for this and add unit tests. This way we might can save some tests in index.test.ts

	if (abstractQuery.modifiers?.limit) {
		const idx = idGen.next().value;
		statement.limit = { parameterIndex: idx };
		statement.parameters[idx] = abstractQuery.modifiers.limit.value;
	}

	if (abstractQuery.modifiers?.offset) {
		const idx = idGen.next().value;
		statement.offset = { parameterIndex: idx };
		statement.parameters[idx] = abstractQuery.modifiers.offset.value;
	}

	if (abstractQuery.modifiers?.sort) {
		statement.order = convertSort(abstractQuery.modifiers.sort);
	}

	return statement;
};
