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

import { RuntimeModule } from "@matrix-org/react-sdk-module-api/lib/RuntimeModule";
import { ModuleApi } from "@matrix-org/react-sdk-module-api/lib/ModuleApi";
import {
    JoinFromPreviewListener,
    RoomPreviewListener,
    RoomViewLifecycle,
} from "@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle";
import { AskNameDialog, AccountModel } from "./components/AskNameDialog";
import React from "react";
import { DialogProps } from "@matrix-org/react-sdk-module-api/lib/components/DialogContent";

export default class IlagModule extends RuntimeModule {
    public constructor(moduleApi: ModuleApi) {
        super(moduleApi);

        this.moduleApi.registerTranslations({
            "Creating your account...": {en: "Creating your account..."},
            "First name": {en: "First name"},
            "Last name": {en: "Last name"},
            "Welcome! Enter your name to join": {en: "Welcome! Enter your name to join"},
        });

        this.on(RoomViewLifecycle.PreviewRoomNotLoggedIn, this.onRoomPreviewBar);
        this.on(RoomViewLifecycle.JoinFromRoomPreview, this.onTryJoin);
    }

    protected onRoomPreviewBar: RoomPreviewListener = (opts, roomId) => {
        opts.canJoin = true; // don't show login/signup options - use "join now" language
    };

    protected onTryJoin: JoinFromPreviewListener = (roomId) => {
        this.moduleApi.openDialog<AccountModel, DialogProps, AskNameDialog>(
            this.t("Welcome! Enter your name to join"),
            (props, ref) => <AskNameDialog ref={ref} {...props} />,
        ).then(async ({ didOkOrSubmit, model }) => {
            if (!didOkOrSubmit) return;

            await this.moduleApi.overwriteAccountAuth(model.creds);
            await this.moduleApi.navigatePermalink(`https://matrix.to/#/${roomId}`, true);
        });
    };
}
