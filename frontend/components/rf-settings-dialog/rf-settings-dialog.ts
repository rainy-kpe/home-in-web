/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Settings Dialog web component
 *
 * The dialog where the settings can be changed.
 *
 * @property {String} wallpaperSource The wallpaper source
 */
@component("rf-settings-dialog")
class RFSettingsDialog extends polymer.Base {
    @property({type: Object})
    auth: FirebaseAuthData;

    @property({type: String, value: "bing", notify: true})
    source: String;

    _authCallBack: any;
    _firebase: Firebase = new Firebase('https://sweltering-fire-9601.firebaseio.com/settings');

    toggle: any = (): void => {
        this.$.dialog.toggle();
    };

    attached(): void {
        this._firebase.onAuth((authData: FirebaseAuthData) => {
            if (authData) {
                this._authCallBack = this._firebase.child(authData.uid).on("value", (snapshot: FirebaseDataSnapshot) => {
                    if (snapshot.val() && snapshot.val().wallpaper) {
                        this.set("source", snapshot.val().wallpaper);
                    }
                }, (error: any) => {
                    console.log("Reading the settings failed: " + error.code);
                });
            } else if (this.auth && this._authCallBack) {
                this._firebase.child(this.auth.uid).off("value", this._authCallBack);
            }
            this.set("auth", authData);
        });
    }

    @observe("source")
    _sourceChanged(newVal: any, oldVal: any): void {
        if (this.auth && this._firebase) {
            this._firebase.child(this.auth.uid).set({
                wallpaper: newVal
            }, (error: any) => {
                if (error) {
                    console.log('Writing the settings failed: ' + JSON.stringify(error));
                }
            });
        }
    }
}

RFSettingsDialog.register();
