/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Youtube Feed web component
 *
 * Downloads the youtube playlist feeds for the urls
 */
@component("rf-youtube-feed")
class RFYoutubeFeed extends polymer.Base {

    // The feed item
    @property({type: Object})
    feed: Feed;

    // All the feed entries
    @property({type: Array, notify: true})
    entries: FeedItem[];

    // Token for the database fetch operation
    _async: any;

    /**
     * Observes the feed changes. Downloads the feeds again.
     * @param  {Feed} newVal
     * @param  {Feed} oldVal
     * @returns void
     */
    @observe("feed")
    _feedChanged(newVal: Feed, oldVal: Feed): void {
        this.async(() => this._downloadFeeds());
    }

    /**
     * Parses the playlist item and creates the FeedItem from the data
     * @param  {any} result The downloaded playlist data
     */
    _parseResult: any = (result: any) => {
        const newItems: FeedItem[] = [];
        result.items.map((item: any) => {
            const image: string = item.snippet.thumbnails ? item.snippet.thumbnails.default.url : undefined;
            if (image) {
                const id: string = item.snippet.resourceId.videoId;

                // The date can be same for multiple videos so adjust it with the
                // position so that the order doesn't change.
                const date: any = new Date(item.snippet.publishedAt);
                date.setSeconds(date.getSeconds() - item.snippet.position);

                newItems.push({
                    image: image,
                    imageLink: undefined,
                    title: item.snippet.title,
                    titleLink: "https://www.youtube.com/watch?v=" + id,
                    snippet: item.snippet.description.substring(0, 100),
                    snippetLink: undefined,
                    description: item.snippet.description,
                    date: date.toISOString(),
                    starred: false
                });
            }
        });

        const all: any[] = _.uniqBy((this.entries || []).concat(newItems), (v: any) => v.title)
            .sort((a: FeedItem, b: FeedItem) => {
                const dtA: Date = new Date(a.date);
                const dtB: Date = new Date(b.date);
                return dtB.getTime() - dtA.getTime();
            });

        this.set("entries", _.take(all, 20));
    };

    /**
     * Downloads the playlists from Youtube
     */
    _downloadFeeds: any = () => {
        if (this.feed.urls) {
            this.feed.urls.map((url: string) => {
                const request: any = new XMLHttpRequest();
                request.onload = () => { this._parseResult(JSON.parse(request.responseText)); };
                request.open("get", "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=" +
                    url + "&key=AIzaSyBBV9COeQ8HNU06pXCHToJEcPXagLlqc2o", true);
                request.send();
            });

            if (this._async) {
                this.cancelAsync(this._async);
            }
            this._async = this.async(this._downloadFeeds, 2 * 60 * 60 * 1000);
        }
    };
}

RFYoutubeFeed.register();
