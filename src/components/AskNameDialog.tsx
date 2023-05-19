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

import * as React from "react";
import { DialogProps, DialogState } from "@matrix-org/react-sdk-module-api/lib/components/DialogContent";
import { DialogContent } from "@matrix-org/react-sdk-module-api/lib/components/DialogContent";
import { TextInputField } from "@matrix-org/react-sdk-module-api/lib/components/TextInputField";
import { Spinner } from "@matrix-org/react-sdk-module-api/lib/components/Spinner";
import { AccountAuthInfo } from "@matrix-org/react-sdk-module-api/lib/types/AccountAuthInfo";
import { ModuleApi } from "@matrix-org/react-sdk-module-api/lib/ModuleApi";

import { fillDisplayname, fillLocalpart, fillPassword, TemplateVars } from "../templates";

interface Props extends DialogProps {
    // we don't need anything new
}

interface State extends DialogState {
    firstName: string;
    lastName: string;
}

export interface AccountModel {
    creds: AccountAuthInfo;
}

export async function registerAccount(moduleApi: ModuleApi, vars: TemplateVars): Promise<AccountAuthInfo> {
    const localpart = fillLocalpart(moduleApi, vars);
    const password = fillPassword(moduleApi, vars);
    const displayName = fillDisplayname(moduleApi, vars);
    return moduleApi.registerSimpleAccount(
        localpart, password, displayName,
    );
}

export class AskNameDialog extends DialogContent<Props, State, AccountModel> {
    public async trySubmit(): Promise<AccountModel> {
        this.setState({ busy: true });
        const creds = await registerAccount(this.props.moduleApi, {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        });
        this.setState({ busy: false });
        return { creds };
    }

    public render() {
        if (this.state.busy) {
            return <>
                <Spinner />
                <p>{ this.t("Creating your account...") }</p>
            </>;
        }

        return <>
            { this.state.error }
            <TextInputField
                label={this.t("First name")}
                value={this.state.firstName}
                onChange={(s) => this.setState({ firstName: s })}
            />
            <TextInputField
                label={this.t("Last name")}
                value={this.state.lastName}
                onChange={(s) => this.setState({ lastName: s })}
            />
        </>;
    }
}
