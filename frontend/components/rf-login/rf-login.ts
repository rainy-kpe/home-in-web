/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rss Login web component
 *
 */
@component("rf-login")
class RFLogin extends polymer.Base {
    @property({type: Object})
    auth: FirebaseAuthData;

    _firebase: Firebase = new Firebase('https://sweltering-fire-9601.firebaseio.com/uauth');

    attached(): void {
        this.$.button.addEventListener("tap", () => {
            if (!this.auth) {
                this._firebase.authWithOAuthPopup("google", (error: any, authData: FirebaseAuthData) => {
                    if (error) {
                        console.log("Login Failed!", JSON.stringify(error));
                        this.set("auth", undefined);
                    } else {
                        this.set("auth", authData);

                        this._firebase.child("users").child(authData.uid).set({
                            provider: authData.provider,
                            name: authData.google.displayName
                        });
                    }
                });
            } else {
                this.$.confirmation.toggle();
            }
        });

        this._firebase.onAuth((authData: FirebaseAuthData) => {
            this.set("auth", authData);
        });

        this.$.confirmButton.addEventListener("tap", () => {
            this._firebase.unauth();
        });
    }
}

RFLogin.register();
