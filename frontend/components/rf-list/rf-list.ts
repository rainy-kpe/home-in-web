/// <reference path="../../../typings/browser.d.ts" />
"use strict";

declare var sha256: any;

/**
 * List web component
 *
 * Shows the feed contents as a list
 */
@component("rf-list")
class RFList extends polymer.Base {

    // The feed item
    @property({type: Object})
    feed: Feed;

    // All the feed entries
    @property({type: Array})
    entries: FeedItem[];

    // The firebase authentication data
    @property({type: Object, notify: true})
    auth: FirebaseAuthData;

    // Flag to show only the starred items
    @property({type: Boolean, value: false})
    showStarred: boolean;

    // The firebase instance
    _firebase: Firebase = new Firebase('https://rainfeeds-dev.firebaseio.com/feeds');

    // The full feed entries
    _normalEntries: any;

    // The starred entries
    _starredEntries: any;

    // Callback to listen for star changes from the database
    _starCallback: any;

    /**
     * Checks if the feed is given type
     * @param  {string} feedType The feed's type
     * @param  {string} type The type to check for
     * @returns true, if the feed is given type
     */
    _isFeedType(feedType: string, type: string): boolean {
        return type === feedType;
    }

    /**
     * Handler for the star-changed event.
     * Writes the starred entry to the database or removes it from there.
     * @param  {any} e The event
     * @returns void
     */
    _starEventHandler: any = (e: any): void => {
        const key: string = sha256(e.detail.titleLink);

        console.log(`Changing the star value for "${e.detail.title}" to ${e.detail.starred}`);

        if (e.detail.starred) {
            this._firebase.child(this.auth.uid).child(this.feed.id).child("starred").child(key)
                .set(e.detail, (error: any) => {
                if (error) {
                    console.log('Writing the starred entry failed: ' + JSON.stringify(error));
                }
            });
        } else {
            this._firebase.child(this.auth.uid).child(this.feed.id).child("starred").child(key).remove((error: any) => {
                if (error) {
                    console.log('Removing the starred entry failed: ' + JSON.stringify(error));
                }
            });
        }
    };

    /**
     * Adds stars to the entries which were found from the database
     * @returns void
     */
    _starEntries(): void {
        if (this._starredEntries && this.entries) {
            this.entries.forEach((entry: any, index: number) => {
                const key: string = sha256(entry.titleLink);
                if (this._starredEntries[key]) {
                    this.set("entries." + index + ".starred", true);
                } else if (entry.starred) {
                    this.set("entries." + index + ".starred", false);
                }
            });
        }
    }

    /**
     * Observer for the "showStarred" property. Changes the entries between the normal feed and starred items.
     * @param  {boolean} newVal The new value
     * @param  {boolean} oldVal The old value
     * @returns void
     */
    @observe("showStarred")
    _showStarredChanged(newVal: boolean, oldVal: boolean): void {
        if (newVal) {
            this._normalEntries = this.entries;
            this.set("entries", _.values(this._starredEntries).sort((a: FeedItem, b: FeedItem) => {
                            const dtA: Date = new Date(a.date);
                            const dtB: Date = new Date(b.date);
                            return dtB.getTime() - dtA.getTime();
                        }));
        } else {
            this.set("entries", this._normalEntries);
        }
    }

    /**
     * Observer for the "entries" property. Adds click handler for the star button in the item.
     * @param  {any[]} newVal The new values
     * @param  {any[]} oldVal The old values
     * @returns void
     */
    @observe("entries")
    _entriesChanged(newVal: any[], oldVal: any[]): void {
        // Set the stars to the entries
        this._starEntries();

        this.async(() => {
            // Add handlers for the "star-changed" events from the items
            const items: any[] = <any> Polymer.dom(this.root).querySelectorAll(".item");
            items.map((item: any) => {
                item.removeEventListener("star-changed", this._starEventHandler);
                item.addEventListener("star-changed", this._starEventHandler);
            });
        });
    }

    /**
     * Registers the handlers
     * @returns void
     */
    attached(): void {

        // When authentication changes read all the starred entries from the database
        this._firebase.onAuth((authData: FirebaseAuthData) => {
            if (authData && !this._starredEntries) {
                this._starCallback = this._firebase.child(authData.uid).child(this.feed.id).child("starred")
                    .on("value", (snapshot: FirebaseDataSnapshot) => {
                    this._starredEntries = snapshot.val();
                    this._starEntries();

                }, (error: any) => {
                    console.log("Reading the starred entries failed: " + error.code);
                });
            } else if (!authData && this.auth) {
                // On logout clear all cached values
                this._firebase.child(this.auth.uid).child(this.feed.id).child("starred").off("value", this._starCallback);
                this._starredEntries = undefined;
                this._starEntries();

                // Switch to the normal mode if we're showning starred items
                if (this.showStarred) {
                    this.set("showStarred", false);
                }
            }
            this.set("auth", authData);
        });
    }
}

RFList.register();
