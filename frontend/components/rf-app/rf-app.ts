/// <reference path="../../../typings/browser.d.ts" />

/**
 * Rainfeeds App web component
 *
 * The main application component
 */
@component("rf-app")
class RFApp extends polymer.Base {
    @property({type: String, value: "bing"})
    wallpaperSource: String;

    attached(): void {
        this.$.settingsButton.addEventListener("tap", () => {
            this.$.settingsDialog.open();
        });
    }
}

RFApp.register();
