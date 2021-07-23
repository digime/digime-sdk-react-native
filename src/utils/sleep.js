import "../definitions/defs";

/**
 * Wait function
 * @param {number} timeMS time in milliseconds before promise returns
 * @returns {Promise<null>}
 */
export const sleep = timeMS => new Promise((resolve) => {
	setTimeout(resolve, timeMS);
});