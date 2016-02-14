/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Login web component
 *
 * Shows button which opens the login / logout dialog.
 */
@component("rf-login")
class RFLogin extends polymer.Base {

    // The authentication data from Firebase
    @property({type: Object})
    auth: FirebaseAuthData;

    // The firebase instance
    _firebase: Firebase = new Firebase('https://sweltering-fire-9601.firebaseio.com/uauth');

    /**
     * Registers the handlers
     * @returns void
     */
    attached(): void {

        // Click handler for the login button. Either authenticates to Google or logs out from it.
        this.$.button.addEventListener("tap", () => {
            if (!this.auth) {
                this._firebase.authWithOAuthPopup("google", (error: any, authData: FirebaseAuthData) => {
                    if (error) {
                        console.log("Login Failed!", JSON.stringify(error));
                        this.set("auth", undefined);
                    } else {
                        this.set("auth", authData);

                        // Store the user to the database if login was successful
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

        // Set the authentication data if it changes
        this._firebase.onAuth((authData: FirebaseAuthData) => {
            this.set("auth", authData);
        });

        // Handle the logout button in the confirmation dialog
        this.$.confirmButton.addEventListener("tap", () => {
            this._firebase.unauth();
        });
    }
}

RFLogin.register();
