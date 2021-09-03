import {request} from './request';

import axios from 'axios'
import MockAdapter from "axios-mock-adapter";

describe("Request", () => {
    let mock;
    const TEST_RESULT = {
        test: 'success'
    };

    const TEST_API = 'https://test.api'

    beforeAll(() => {
        mock = new MockAdapter(axios);
    })

    afterEach(() => {
        mock.reset();
    });

    it('Will resolve requests on successful API call', async () => {
        mock.onGet(TEST_API).reply(200, {
            ... TEST_RESULT
        });
        const result = await request.direct.get(TEST_API)
        expect(result.data).toStrictEqual(TEST_RESULT)
    });

    it("Will reject requests on network error", async () => {
        mock.onGet(TEST_API).networkError();
        return expect(request.direct.get(TEST_API)).rejects.toThrowError();
    })
})
