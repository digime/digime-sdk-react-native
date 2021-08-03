import {isString} from "lodash";

/**
 * Checks if {@link data} is a non-empty string
 * @param {string} data
 * @returns {Boolean} result
 */
export const isNonEmptyString = data /* (o: unknown): o is string  */=>
	isString(data) && data.length > 0;

/**
 * Checks if {@link data} has non-empty strings
 * @param {string[]} data
 * @returns {Boolean}
 */
export const areNonEmptyStrings = data /* (o: unknown[]): o is string[] */ =>
	data.every((value) => isNonEmptyString(value));