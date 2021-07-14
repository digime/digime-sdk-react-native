
export const ReadFile = data => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            const {result} = fileReader;
            const base64String = result.split(",").pop().trim();
            const binaryContent = toByteArray(base64String);
            resolve(binaryContent)
        }

        fileReader.onerror = () => {
            fileReader.abort();
            reject();
        }

        fileReader.readAsDataURL(data);
    })
}