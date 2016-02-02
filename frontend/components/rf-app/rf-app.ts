/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rainfeeds App web component
 *
 * The main application component
 */
@component("rf-app")
class RFApp extends polymer.Base {
    @property({type: String})
    source: String;

    attached(): void {
        this.$.settingsButton.addEventListener("tap", () => {
            this.$.settingsDialog.toggle();
        });
    }
}

RFApp.register();
