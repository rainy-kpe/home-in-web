/// <reference path="../../../typings/browser.d.ts" />
"use strict";

declare var sha256: any;

/**
 * Rss Feed web component
 *
 */
@component("rf-rss-feed")
class RFRssFeed extends polymer.Base {

    @property({type: Object})
    feed: any;

    @property({type: Array})
    entries: any[];

    @property({type: String})
    error: string;

    @property({type: Object})
    auth: FirebaseAuthData;

    _firebase: Firebase = new Firebase('https://sweltering-fire-9601.firebaseio.com/feeds');
    _starredEntries: any;
    _starCallback: any;

    _starEntries(): void {
        if (this._starredEntries && this.entries) {
            this.entries.forEach((entry: any, index: number) => {
                const key: string = sha256(entry.link);
                if (this._starredEntries[key]) {
                    this.set("entries." + index + ".starred", true);
                } else if (entry.starred) {
                    this.set("entries." + index + ".starred", false);
                }
            });
        }
    }

    @observe("entries")
    _entriesChanged(newVal: any[], oldVal: any[]): void {
        this._starEntries();

        this.async(() => {
            const items: any[] = <any> Polymer.dom(this.root).querySelectorAll(".item");
            items.map((item: any) => item.addEventListener("star-changed", (e: any) => {
                const key: string = sha256(e.detail.link);

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
            }));
        });
    }

    attached(): void {
        this._firebase.onAuth((authData: FirebaseAuthData) => {
            if (authData && !this._starredEntries) {
                this._starCallback = this._firebase.child(authData.uid).child(this.feed.id).child("starred")
                    .on("value", (snapshot: FirebaseDataSnapshot) => {
                    this._starredEntries = snapshot.val();
                    this._starEntries();

                    // console.log(JSON.stringify(this._starredEntries));
                }, (error: any) => {
                    console.log("Reading the starred entries failed: " + error.code);
                });
            } else if (!authData && this.auth) {
                this._firebase.child(this.auth.uid).child(this.feed.id).child("starred").off("value", this._starCallback);
                this._starredEntries = undefined;
                this._starEntries();
            }
            this.set("auth", authData);
        });

        this.async(() => {
            const feeds: any[] = <any> Polymer.dom(this.root).querySelectorAll(".feed");
            feeds.map((feed: any) => feed.addEventListener("google-feeds-error", (e: any) => {
                console.log("ERROR: " + e.status);
            }));

            feeds.map((feed: any) => feed.addEventListener("google-feeds-response", (e: any) => {

                if (this.feed.urls.length === 1) {
                    this.set("entries", feed.results.entries);

                    // Update feed every 15 minutes
                    this.async(() => feed._fetchFeeds(), 15 * 60 * 1000);
                } else {
                    // Merge feeds
                    const all: any[] = _.uniqBy((this.entries || []).concat(feed.results.entries), (v: any) => v.title)
                        .sort((a: any, b: any) => {
                            const dtA: Date = new Date(a.publishedDate);
                            const dtB: Date = new Date(b.publishedDate);
                            return dtB.getTime() - dtA.getTime();
                        });

                    this.set("entries", _.take(all, 20));

                    // Update feeds every 60 minutes
                    this.async(() => feed._fetchFeeds(), 60 * 60 * 1000);
                }
            }));
        });
    }
}

RFRssFeed.register();
