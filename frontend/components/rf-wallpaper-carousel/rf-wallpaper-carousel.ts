/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Wallpaper Carousel web component
 *
 * Downloads a new wallpaper from selected locations and sets it as a background.
 */
@component("rf-wallpaper-carousel")
class RFWallpaperCarousel extends polymer.Base {

    // The feed contents
    @property({type: Object})
    feed: any;

    // The url for the background image
    @property({type: String})
    imgUrl: String;

    // The wallpaper provider
    @property({type: String})
    source: String;

    // The source feed url
    @property({type: String, computed: "_computeSourceFeed(source)"})
    sourceFeed: String;

    // A flag which causes the background to be blurred
    @property({type: Object, value: true})
    blurImage: boolean;

    /**
     * Returns the class name for the background.
     * @param  {boolean} blur Set to true if the background is blurred
     * @returns string The class name
     */
    _getClass(blur: boolean): string {
        return blur ? "blur" : "";
    }

    /**
     * Returns the sourceFeed for the given source
     * @param  {string} source The selected wallpaper source
     * @returns string The rss feed url for the source
     */
    _computeSourceFeed(source: string): any {
        if (source === "thepaperwall") {
            return {
                urls: ["http://thepaperwall.com/rss.day.php"]
            };
        } else if (source === "bing") {
            return {
                urls: ["http://www.bing.com/HPImageArchive.aspx?format=rss&idx=0&n=1"]
            };
        } else {
            console.log("Unknown source: " + source);
            return {};
        }
    }

    /**
     * Observer for the feed changes. Parses the image (imgUrl) from the feed.
     * @param  {any} newVal The new value for the "feed"
     * @param  {any} oldVal The old value for the "feed"
     * @returns void
     */
    @observe("feed")
    _feedChanged(newVal: any, oldVal: any): void {
        if (newVal && newVal.length > 0) {
            if (this.source === "thepaperwall") {
                this._parseThePaperWall(newVal[0].description);
            } else if (this.source === "bing") {
                this._parseBing(newVal[0].description);
            }

            // Update feed every 2 hours
            this.async(() => this.$.feed._fetchFeeds(), 2 * 60 * 60 * 1000);
        }
    }

    /**
     * Parses the image url from the paper wall feed.
     * @param {string} content The feed content
     * @returns void
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
     * @param {string} content The feed content
     * @returns void
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
