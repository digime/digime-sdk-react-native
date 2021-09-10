import get from "lodash/get";
import set from "lodash/set";

/**
 * @param {Array.<{lookupKey:string, outputKey:string|number, source:Objet<string, string|number>}>} inputMap
 * @returns {Object.<string, string|number>}
 */
export const createObjectFrom = (inputMap) => {
	return inputMap.map(({lookupKey, outputKey, source}) => {
		const value = get(source, lookupKey);
		if (value) {
			return {key: outputKey, value};
		}
		return;
	})
		.filter(value => !!value)
		.reduce((prev, {key, value}) => {
			set(prev, key, value);
			return prev;
		}, {});
};
