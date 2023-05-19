/*
Copyright 2023 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ModuleApi } from "@matrix-org/react-sdk-module-api/lib/ModuleApi";

import { registerAccount } from "../src/components/AskNameDialog";

Object.defineProperty(globalThis, 'crypto', {
    value: {
        getRandomValues<T extends ArrayBufferView | null>(array: T): T {
            // no-op to ensure repeatable randomness
            return array;
        },
    },
});

type MockedModuleApi = {
    [key in keyof ModuleApi]: jest.MockedFunction<ModuleApi[key]>
};

function mockModuleApi(): MockedModuleApi {
    return {
        registerTranslations: jest.fn(),
        translateString: jest.fn(),
        openDialog: jest.fn(),
        navigatePermalink: jest.fn(),
        overwriteAccountAuth: jest.fn(),
        registerSimpleAccount: jest.fn(),
        getConfigValue: jest.fn(),
    };
}

function mockRandomString(): string {
    const buf = new Uint8Array(64);
    crypto.getRandomValues(buf);
    return Buffer.from(buf).toString('hex').toLowerCase();
}

describe("registration", () => {
    const mockedRandomString = mockRandomString();

    it('should have working defaults', async () => {
        const config: Record<string, Record<string, string>> = {
            "io.element.module.ilag": {
                "localpartTemplate": "",
                "displaynameTemplate": "",
                "passwordTemplate": "",
            },
        };

        const moduleApi = mockModuleApi();
        moduleApi.registerSimpleAccount.mockResolvedValue(null);
        moduleApi.getConfigValue.mockImplementation((namespace, key) => {
            return config[namespace]?.[key];
        });
        await registerAccount(moduleApi, {
            firstName: "Erika",
            lastName: "Musterfrau",
        });
        expect(moduleApi.registerSimpleAccount).toHaveBeenCalledWith(
            "erika_musterfrau",
            mockedRandomString,
            "Erika Musterfrau",
        );
    });

    it('should support customizing the templates', async () => {
        const config: Record<string, Record<string, string>> = {
            "io.element.module.ilag": {
                "localpartTemplate": "this{firstName}is{lastName}a{randomString}test",
                "displaynameTemplate": "this{firstName}is{lastName}a{randomString}test",
                "passwordTemplate": "this{firstName}is{lastName}a{randomString}test",
            },
        };

        const moduleApi = mockModuleApi();
        moduleApi.registerSimpleAccount.mockResolvedValue(null);
        moduleApi.getConfigValue.mockImplementation((namespace, key) => {
            return config[namespace]?.[key];
        });
        await registerAccount(moduleApi, {
            firstName: "Erika",
            lastName: "Musterfrau",
        });
        expect(moduleApi.registerSimpleAccount).toHaveBeenCalledWith(
            `thiserikaismusterfraua${mockedRandomString}test`,
            `thiserikaismusterfraua${mockedRandomString}test`,
            `thisErikaisMusterfraua${mockedRandomString}test`,
        );
    });
});
