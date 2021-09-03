jest.mock("react-native", () => {
    // use original implementation
    const RN = jest.requireActual("react-native");

    // mock modules/components created by assigning to NativeModules
    RN.NativeModules.RNRandomBytes = {
        seed: "test-random-seed-value"
    };

    return RN;
});
