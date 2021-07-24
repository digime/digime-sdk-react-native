import { readFile } from "jsrsasign";
import { DigiMeSDKError } from "../errors/errors";

/**
 * @typedef ReadAccountsOptions
 * @property {string} sessionKey
 * @property {string} privateKey
 */

/**
 * Retrieve the users accounts.json file. This file contains meta details about
 * the services onborded in the current users library
 * @async
 * @function readAccounts
 * @param {ReadAccountsOptions} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<>}
 */
export const readAccounts = async (props,sdkConfig) => {
	const { sessionKey, privateKey } = props;
	const { fileData } = await readFile(
		{
			sessionKey,
			fileName: "accounts.json",
			privateKey,
		},
		sdkConfig
	);

	try {
		return {
			accounts: JSON.parse(fileData.toString("utf8")),
		};
	} catch (error) {
		throw new DigiMeSDKError("Account file is malformed.");
	}
};
