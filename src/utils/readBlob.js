import { util } from "node-forge";

/**
 * Reads a blob data type returned from the API
 * into an Uint8Array
 * @function ReadBlob
 * @param {Blob} data
 * @returns {Promise<Uint8Array>}
 */
export const ReadBlob = data => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onloadend = () => {
			const {result} = fileReader;

			// extract the base64 component by
			// removing the content identifier
			const base64String = result.split(",").pop().trim();
			const binaryContent = util.binary.base64.decode(base64String);
			resolve(binaryContent);
		};

		fileReader.onerror = () => {
			fileReader.abort();
			reject();
		};

		fileReader.readAsDataURL(data);
	});
};