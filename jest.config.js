module.exports = {
    "preset": "react-native",
    "testEnvironment": "node",
    "transform": {
      "^.+\\.(ts|js)$": "babel-jest"
    },
    moduleFileExtensions: [
      'js',
    ],
    verbose: true,
    testRegex: '(/__tests__/.*|\\.(spec))\\.js$',
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    projects: ['<rootDir>'],
    "transformIgnorePatterns": [
        "node_modules/(?!(@react-native|react-native|react-native-randombytes|react-native-url-polyfill|react-native-deep-linking|react-native-inappbrowser-reborn)/)"
    ],
    cacheDirectory: '.jest/cache',
    setupFiles: [
        "<rootDir>/tests/__mocks__/react-native.js"
    ]
};
