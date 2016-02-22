/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Card area web component
 *
 * The container for the feed cards
 */
@component("rf-card-area")
class RFCardArea extends polymer.Base {

    // The feeds that are shown in the cards
    @property({type: Array})
    feeds: any;

    // The firebase authentication data
    @property({type: Object})
    auth: FirebaseAuthData;

    // The firebase instance
    _firebase: Firebase = new Firebase('https://sweltering-fire-9601.firebaseio.com/feeds');

    // The read settings callback
    _authCallBack: any;

    /**
     * Register the firebase login callback
     * @returns void
     */
    attached(): void {
        this._firebase.onAuth((authData: FirebaseAuthData) => {
            this.set("auth", authData);
        });
    }

    /**
     * Observes the firebase auth changes. Reads the feeds from the database when
     * the user signs in.
     * @param  {any} newVal The new value
     * @param  {any} oldVal The old value
     * @returns void
     */
    @observe("auth")
    _authChanged(newVal: any, oldVal: any): void {
        if (newVal) {
            this._authCallBack = this._firebase.child(newVal.uid).on("value", (snapshot: FirebaseDataSnapshot) => {
                if (snapshot.val()) {
                    const feeds: any[] = _.values(snapshot.val())
                                          .map((item: any) => item.settings)
                                          .sort((a: any, b: any) => a.order - b.order);
                    this.set("feeds", feeds);
                }
            }, (error: any) => {
                console.log("Reading the feeds from database failed: " + error.code);
            });
        } else {
            // Clear the feeds if the user signs out
            this.set("feeds", undefined);
            if (oldVal) {
                this._firebase.child(oldVal.uid).off("value", this._authCallBack);
            }
        }
    }
}

RFCardArea.register();
