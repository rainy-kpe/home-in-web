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
    feeds: Feed[];

    // The firebase authentication data
    @property({type: Object})
    auth: FirebaseAuthData;

    // The firebase instance
    _firebase: Firebase = new Firebase('https://sweltering-fire-9601.firebaseio.com/feeds');

    // The read settings callback
    _authCallBack: any;

    /**
     * Handler for the feed-deleted event.
     * Deletes the given feed. Also from database.
     * @param  {any} e The event
     * @returns void
     */
    _deleteEventHandler: any = (e: any): void => {
        console.log(`Deleting the feed "${e.detail.title}"`);
        this.set("feeds", _.filter(this.feeds, (feed: Feed) => feed.id !== e.detail.id));

        this._firebase.child(this.auth.uid).child(e.detail.id).remove((error: any) => {
            if (error) {
                console.log('Removing the feed failed: ' + JSON.stringify(error));
            }
        });
    };

    /**
     * Register the firebase login callback
     * @returns void
     */
    attached(): void {
        this._firebase.onAuth((authData: FirebaseAuthData) => {
            this.set("auth", authData);
        });

        this.$.newFeed.addEventListener("tap", () => {
            const newFeed: Feed = {
                order: this.feeds.length + 1,
                id: this._guid(),
                type: "rss",
                name: "",
                urls: []
            };
            this.set("feeds", _.concat(this.feeds, [newFeed]));
        });
    }

    /**
     * Observes the changes in the feed. Adds handlers for the feed card deletion.
     * @param  {Feed[]} newVal
     * @param  {Feed[]} oldVal
     * @returns void
     */
    @observe("feeds")
    _feedsChanged(newVal: Feed[], oldVal: Feed[]): void {
        this.async(() => {
            // Add handlers for the "feed-deleted" events from the cards
            const items: any[] = <any> Polymer.dom(this.root).querySelectorAll(".item");
            items.map((item: any) => {
                item.removeEventListener("feed-deleted", this._deleteEventHandler);
                item.addEventListener("feed-deleted", this._deleteEventHandler);
            });
        });
    }

    /**
     * Observes the firebase auth changes. Reads the feeds from the database when
     * the user signs in.
     * @param  {FirebaseAuthData} newVal The new value
     * @param  {FirebaseAuthData} oldVal The old value
     * @returns void
     */
    @observe("auth")
    _authChanged(newVal: FirebaseAuthData, oldVal: FirebaseAuthData): void {
        if (newVal) {
            this._authCallBack = this._firebase.child(newVal.uid).on("value", (snapshot: FirebaseDataSnapshot) => {
                if (snapshot.val()) {
                    const feeds: Feed[] = _.values(snapshot.val())
                                          .map((item: any) => item.settings)
                                          .sort((a: Feed, b: Feed) => a.order - b.order);
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

    /**
     * Generates a random guid
     */
    _guid(): string {
        const s4: (() => string) = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}

RFCardArea.register();
