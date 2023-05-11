/*
Copyright 2022 New Vector Ltd. t/a Element

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

import format from "string-template";
import { ModuleApi } from "@matrix-org/react-sdk-module-api/lib/ModuleApi";

const DEFAULT_LOCALPART_TEMPLATE = "{firstName}_{lastName}";
const DEFAULT_DISPLAYNAME_TEMPLATE = "{firstName} {lastName}";
const DEFAULT_PASSWORD_TEMPLATE = "{randomString}";

export type TemplateVars = {
    firstName: string;
    lastName: string;
};

export function fillTemplate(templateStr: string, vars: TemplateVars, lowerCase: boolean): string {
    const buf = new Uint8Array(64);
    crypto.getRandomValues(buf);
    const newVars = {
        firstName: lowerCase ? vars.firstName.toLowerCase() : vars.firstName,
        lastName: lowerCase ? vars.lastName.toLowerCase() : vars.lastName,
        randomString: Buffer.from(buf).toString('hex').toLowerCase(),
    };

    return format(templateStr, newVars);
}

export function fillLocalpart(moduleApi: ModuleApi, vars: TemplateVars): string {
    const str = moduleApi.getConfigValue("io.element.module.ilag", "localpartTemplate")
        || DEFAULT_LOCALPART_TEMPLATE;
    if (typeof str !== "string") throw new Error("Runtime error: localpartTemplate is not a string");
    return fillTemplate(str, vars, true);
}

export function fillDisplayname(moduleApi: ModuleApi, vars: TemplateVars): string {
    const str = moduleApi.getConfigValue("io.element.module.ilag", "displaynameTemplate")
        || DEFAULT_DISPLAYNAME_TEMPLATE;
    if (typeof str !== "string") throw new Error("Runtime error: displaynameTemplate is not a string");
    return fillTemplate(str, vars, false);
}

export function fillPassword(moduleApi: ModuleApi, vars: TemplateVars): string {
    const str = moduleApi.getConfigValue("io.element.module.ilag", "passwordTemplate")
        || DEFAULT_PASSWORD_TEMPLATE;
    if (typeof str !== "string") throw new Error("Runtime error: passwordTemplate is not a string");
    return fillTemplate(str, vars, true);
}
