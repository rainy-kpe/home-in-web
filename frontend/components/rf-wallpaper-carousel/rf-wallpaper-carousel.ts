/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Wallpaper Carousel web component
 *
 * Downloads a new wallpaper from selected locations and sets it as a background.
 *
 * @property {Object} feed The downloaded rss image feed
 * @property {String} imgUrl The image url
 * @property {String} source The image source: "thepaperwall", "bing"
 * @property {String} sourceFeed The source feed url
 */
@component("rf-wallpaper-carousel")
class RFWallpaperCarousel extends polymer.Base {

    @property({type: Object})
    feed: any;

    @property({type: String})
    imgUrl: String;

    @property({type: String})
    source: String;

    @property({type: String, computed: "_computeSourceFeed(source)"})
    sourceFeed: String;

    @property({type: Object, value: true})
    blurImage: boolean;

    _getClass(blur: boolean): string {
        return blur ? "blur" : "";
    }

    /**
     * Returns the sourceFeed for the given source
     */
    _computeSourceFeed(source: string): string {
        if (source === "thepaperwall") {
            return "http://thepaperwall.com/rss.day.php";
        } else if (source === "bing") {
            return "http://www.bing.com/HPImageArchive.aspx?format=rss&idx=0&n=1";
        } else {
            console.log("Unknown source: " + source);
            return "";
        }
    }

    /**
     * Observer for the feed changes. Parses the image (imgUrl) from the feed.
     */
    @observe("feed")
    _feedChanged(newVal: any, oldVal: any): void {
        if (newVal && newVal.entries.length > 0) {
            if (this.source === "thepaperwall") {
                this._parseThePaperWall(newVal.entries[0].content);
            } else if (this.source === "bing") {
                this._parseBing(newVal.entries[0].content);
            }

            // Update feed every 2 hours
            this.async(() => this.$.feed._fetchFeeds(), 2 * 60 * 60 * 1000);
        }
    }

    /**
     * Parses the image url from the paper wall feed.
     */
    _parseThePaperWall(content: string): void {
        const regExp: RegExp = /<img src="(.+?)\?/g;
        const parsed: Array<string> = regExp.exec(content);
        if (parsed.length > 1) {
            const url: string = parsed[1].split("small").join("big");
            this.set("imgUrl", url);
        }
    }

    /**
     * Parses the image url from the bing feed.
     */
    _parseBing(content: string): void {
        const regExp: RegExp = /src="(.+?)"/g;
        const parsed: Array<string> = regExp.exec(content);
        if (parsed.length > 1) {
            const url: string = parsed[1].split("1366x768").join("1920x1080");
            this.set("imgUrl", "http://www.bing.com" + url);
        }
    }
}

RFWallpaperCarousel.register();
