import { util } from "node-forge";

export const ReadBlob = data => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            const {result} = fileReader;
            const base64String = result.split(",").pop().trim();
            const binaryContent = util.binary.base64.decode(base64String)
            resolve(binaryContent)
        }

        fileReader.onerror = () => {
            fileReader.abort();
            reject();
        }

        fileReader.readAsDataURL(data);
    })
}