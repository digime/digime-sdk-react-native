import {notValidStrings} from '../../tests/constants/testConstants';
import {init} from './deepLinking';
import {TypeValidationError} from './errors/errors';

describe("Deep linking", () => {
    it.each(notValidStrings)("Will throw TypeValidationError when scheme is `%p`", (option) => {
        expect(() => {
            init(option)
        }).toThrow(TypeValidationError)
    })
})
