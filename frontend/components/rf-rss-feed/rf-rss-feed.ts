/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rss Feed web component
 *
 */
@component("rf-rss-feed")
class RFRssFeed extends polymer.Base {

    @property({type: Object})
    feed: any;

    @property({type: Array})
    entries: any;

    @property({type: String})
    error: string;

    attached(): void {
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
