/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rss Feed web component
 *
 * Downloads the rss feeds for the urls
 */
@component("rf-rss-feed")
class RFRssFeed extends polymer.Base {

    // The feed item
    @property({type: Object})
    feed: Feed;

    // All the feed entries
    @property({type: Array, notify: true})
    entries: FeedItem[];

    /**
     * Converts the rss feed entry to FeedItem
     * @param  {any} entry
     * @returns FeedItem
     */
    _createItem(entry: any): FeedItem {
        // Check if the content has an image
        const imgUrl: string[] = entry.content.match(/src=\"(http:\/\/.+?.jpg)/);
        // Try to find a link for the image
        const link: string[] = entry.content.match(/<span><a href=\"(.+?)\">\[link\]<\/a><\/span>/);
        // Find any link in the content
        const pageLink: string[] = entry.content.match(/<a href=\"(.+?)\">/);

        return {
            image: _.head(imgUrl) || "",
            imageLink: _.head(link) || "",
            title: entry.title,
            titleLink: entry.link,
            snippet: entry.contentSnippet,
            snippetLink: _.head(pageLink) || "",
            description: entry.content,
            date: entry.publishedDate,
            starred: entry.starred
        };
    }

    /**
     * Registers the handlers
     * @returns void
     */
    attached(): void {

        this.async(() => {
            // Add error handler for all the feeds
            const feeds: any[] = <any> Polymer.dom(this.root).querySelectorAll(".feed");
            feeds.map((feed: any) => feed.addEventListener("google-feeds-error", (e: any) => {
                console.log("ERROR: " + JSON.stringify(e.status));
            }));

            // Add handler for the feed results
            feeds.map((feed: any) => feed.addEventListener("google-feeds-response", (e: any) => {

                if (this.feed.urls.length === 1) {
                    this.set("entries", feed.results.entries.map((entry: any) => this._createItem(entry)));

                    // Update feed every 15 minutes
                    this.async(() => feed._fetchFeeds(), 15 * 60 * 1000);
                } else {
                    // Merge feeds
                    const newItems: FeedItem[] = feed.results.entries.map((entry: any) => this._createItem(entry));
                    const all: any[] = _.uniqBy((this.entries || []).concat(newItems), (v: any) => v.title)
                        .sort((a: FeedItem, b: FeedItem) => {
                            const dtA: Date = new Date(a.date);
                            const dtB: Date = new Date(b.date);
                            return dtB.getTime() - dtA.getTime();
                        });

                    this.set("entries", _.take(all, 20));

                    // Update feeds every 15 minutes per feed
                    this.async(() => feed._fetchFeeds(), this.feed.urls.length * 15 * 60 * 1000);
                }
            }));
        });
    }
}

RFRssFeed.register();
