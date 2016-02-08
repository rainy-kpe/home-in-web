/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rainfeeds App web component
 *
 * The main application component
 */
@component("rf-app")
class RFApp extends polymer.Base {

    @property({type: String, value: false})
    showBackground: string;

    attached(): void {
        this.$.settingsButton.addEventListener("tap", () => {
            this.$.settingsDialog.toggle();
        });

        this.$.bgButton.addEventListener("tap", () => {
            this.set("showBackground", !this.showBackground);
        });
    }
}

RFApp.register();
