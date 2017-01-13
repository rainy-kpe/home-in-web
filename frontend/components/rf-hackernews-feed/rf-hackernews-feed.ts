/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Hacker News Feed web component
 *
 * Downloads the hacker news top feed
 */
@component("rf-hackernews-feed")
class RFHackerNewsFeed extends polymer.Base {

    // The feed item
    @property({type: Object})
    feed: Feed;

    // All the feed entries
    @property({type: Array, notify: true})
    entries: FeedItem[];

    // Link to the site
    @property({type: String, notify: true, value: "http://hckrnews.com/"})
    link: string;

    // The firebase instance
    _firebase: Firebase = new Firebase('https://hacker-news.firebaseio.com/v0');

    _stories: Map<string, FeedItem> = new Map<string, FeedItem>();

    /**
     * Observes the feed changes. Downloads the feed again.
     * @param  {Feed} newVal
     * @param  {Feed} oldVal
     * @returns void
     */
    @observe("feed")
    _feedChanged(newVal: Feed, oldVal: Feed): void {
        this.async(() => this._downloadTopStories());
    }

    /**
     * Downloads the top stories
     */
    _downloadTopStories: any = () => {
        this._firebase.child("topstories").off("value", this._storiesDownloaded);
        this._firebase.child("topstories").on("value", this._storiesDownloaded, (error: any) => {
            console.log("Reading the top stories for hacker news failed: " + error.code);
        });
    };

    _storiesDownloaded: any = (snapshot: FirebaseDataSnapshot) => {
        // console.log("Downloaded top stories from Hacker News");

        if (snapshot.val()) {
            // Remove all stories which are not in the top stories anymore
            const ids: Set<string> = new Set<string>();
            this._stories.forEach((value: FeedItem, key: string) => ids.add(key));
            snapshot.val().map((id: string) => ids.delete(id));
            ids.forEach((id: string) => {
                this._firebase.child("item").child(id).off("value", this._itemDownloaded);
                this._stories.delete(id);

                // console.log(`Removed story ${id}`);
            });

            // Add all new stories
            _.take(snapshot.val(), 30).map((id: string) => {
                if (!this._stories.has(id)) {
                    this._firebase.child("item").child(id).on("value", this._itemDownloaded);
                    // console.log(`Added story ${id}`);
                }
            });
        }
    };

    _itemDownloaded: any = (snapshot: FirebaseDataSnapshot) => {
        this._stories.set(snapshot.val().id, {
            image: "",
            imageLink: "",
            title: snapshot.val().title,
            titleLink: snapshot.val().url,
            snippet: `Score: ${snapshot.val().score} by ${snapshot.val().by} | Comments: ${snapshot.val().descendants}`,
            snippetLink: "https://news.ycombinator.com/item?id=" + snapshot.val().id,
            description: undefined,
            date: snapshot.val().time + "000",
            starred: false,
            score: parseInt(snapshot.val().score, 10)
        });

        // Take 20 best stories
        let items: FeedItem[] = [];
        this._stories.forEach((value: FeedItem) => items.push(value));
        items = _.take(items.sort((a: FeedItem, b: FeedItem) => b.score - a.score), 20);

        // Sort by time
        items.sort((a: FeedItem, b: FeedItem) => parseInt(b.date, 10) - parseInt(a.date, 10));

        this.set("entries", items);
    };
}

RFHackerNewsFeed.register();
