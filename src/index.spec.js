import * as SDK from './index'
import {notValidStrings} from '../tests/constants/testConstants';
import {TypeValidationError} from './sdk/errors/errors';

describe("Index", () => {
    it("Has SDK init", () => {
        expect(SDK).toHaveProperty('init', expect.any(Function));
    })
    it("Has Browser init", () => {
        expect(SDK).toHaveProperty('Browser');
    })
    it("Has Applinking init", () => {
        expect(SDK).toHaveProperty('AppLinking');
    })
})

describe("SDK.init", () => {
    describe("Returns functions", () => {
        let sdkFunctions;

        beforeAll(() => {
            sdkFunctions = SDK.init({applicationId: "test-application-id"})
        });

        it.each([
            "getAuthorizeUrl",
            "getOnboardServiceUrl",
            "exchangeCodeForToken",
            "write",
            "readSession",
            "deleteUser",
            "getAvailableServices",
            "readFile",
            "readFileList",
            "readAllFiles",
            "readAccounts",
        ])("Has `%s` function", (property) => {
            expect(sdkFunctions).toHaveProperty(property, expect.any(Function));
        });
    });

    describe("Validation check for init() param", () => {
        it.each(notValidStrings)("Will throw TypeValidationError when init(options) is `%p`", (options) => {
            expect(() => SDK.init(options)).toThrow(TypeValidationError);
        })
    })

    describe("Validation check for applicationId on init() param", () => {
        it.each(notValidStrings)("Will throws TypeValidationError when applicationId is `%p`", (applicationId) => {
            expect(() => SDK.init({applicationId})).toThrow(TypeValidationError);
        })
    })
});


describe("SDK.Applinking returns functions", () => {
    let deeplinkingFunctions = SDK.AppLinking.init("test-scheme");

    it.each(["addRoute", "unload"])("Has `%s` function", (property) => {
        expect(deeplinkingFunctions).toHaveProperty(property, expect.any(Function));
    })
})

describe("SDK.Browser returns functions", () => {
    let browserFunctions = SDK.Browser;

    it.each(["openUrl"])("Has `%s` function", (property) => {
        expect(browserFunctions).toHaveProperty(property, expect.any(Function));
    })
})
