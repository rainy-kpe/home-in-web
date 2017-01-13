/// <reference path="../../../typings/browser.d.ts" />
"use strict";

declare var RSSParser: any;

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

    // Link to the site
    @property({type: String, notify: true})
    link: string;

    /**
     * Converts the rss feed entry to FeedItem
     * @param  {any} entry
     * @returns FeedItem
     */
    _createItem(entry: any): FeedItem {
        const content: string = entry.summary ? entry.summary.content : entry.content.content;

        // Check if the content has an image
        const imgUrl: string[] = content.match(/src=\"(http.+?.jpg)/);
        // Try to find a link for the image
        const link: string[] = content.match(/<span><a href=\"(.+?)\">\[link\]<\/a><\/span>/);
        // Find any link in the content
        const pageLink: string[] = content.match(/<a href=\"(.+?)\">/);

        return {
            image: imgUrl && imgUrl.length > 1 ? imgUrl[1] : "",
            imageLink: link && link.length > 1 ? link[1] : "",
            title: entry.title.content ? entry.title.content : entry.title,
            titleLink: Array.isArray(entry.link) ? entry.link[0].href : entry.link.href,
            snippet: content.replace(/(<([^>]+)>)/ig, "").slice(0, 200),
            snippetLink: pageLink && pageLink.length > 1 ? pageLink[1] : "",
            description: content,
            date: entry.updated,
            starred: entry.starred
        };
    }

    /**
     * Registers the handlers
     * @returns void
     */
    attached(): void {
        this.async(() => {
            this._downloadFeeds();
        });
    }

    _downloadFeeds(): void {
        this.feed.urls.forEach(url => {
            const feedUrl: string = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
                                    'select * from feednormalizer where url="' + encodeURIComponent(url) + '" and output="atom_1.0"';

            const request: any = new XMLHttpRequest();
            request.onload = () => {
                const results: any = JSON.parse(request.responseText).query.results;
                if (results.error) {
                    console.log(results.error);
                } else {
                    const feed: any = results.feed;

                    if (Array.isArray(feed.link)) {
                        this.set("link", feed.link[0].href.split("/").slice(0, 3).join("/"));
                    } else {
                        this.set("link", feed.link.href.split("/").slice(0, 3).join("/"));
                    }

                    if (this.feed.urls.length === 1) {
                        if (Array.isArray(feed.entry)) {
                            this.set("entries", feed.entry.map((entry: any) => this._createItem(entry)));
                        } else {
                            this.set("entries", [this._createItem(feed.entry)]);
                        }

                        // Update feed every 15 minutes
                        this.async(() => this._downloadFeeds(), 15 * 60 * 1000);
                    } else {
                        // Merge feeds
                        let newItems: FeedItem[];
                        if (Array.isArray(feed.entry)) {
                            newItems = feed.entry.map((entry: any) => this._createItem(entry));
                        } else {
                            newItems = [this._createItem(feed.entry)];
                        }

                        const all: any[] = _.uniqBy((this.entries || []).concat(newItems), (v: any) => v.title)
                            .sort((a: FeedItem, b: FeedItem) => {
                                const dtA: Date = new Date(a.date);
                                const dtB: Date = new Date(b.date);
                                return dtB.getTime() - dtA.getTime();
                            });

                        this.set("entries", _.take(all, 20));

                        // Update feeds every 15 minutes per feed
                        this.async(() => this._downloadFeeds(), this.feed.urls.length * 15 * 60 * 1000);
                    }
                }
            };
            request.open("get", feedUrl, true);
            request.send();
        });
    }
}

RFRssFeed.register();
