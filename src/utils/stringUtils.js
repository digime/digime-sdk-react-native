import {isString} from "lodash";
import "../definitions/defs";

/**
 * Checks if {@link data} is a non-empty string
 * @param {string} data
 * @returns {Boolean} result
 */
export const isNonEmptyString = data /* (o: unknown): o is string  */=>
	isString(data) && data.length > 0;

/**
 * Checks if {@link data} has non-empty strings
 * @param {String[]} data
 * @returns {Boolean}
 */
export const areNonEmptyStrings = data /* (o: unknown[]): o is string[] */ =>
	data.every((value) => isNonEmptyString(value));