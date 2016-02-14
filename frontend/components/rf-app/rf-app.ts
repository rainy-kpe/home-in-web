/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rainfeeds App web component
 *
 * The main application component
 */
@component("rf-app")
class RFApp extends polymer.Base {

    // Flag to show the background without blur and feed cards
    @property({type: Boolean, value: false})
    showBackground: boolean;

    /**
     * Registers the button handlers
     * @returns void
     */
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
