/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rss Feed Item web component
 *
 * A single item of the feed. Handles starring and unstarring.
 */
@component("rf-rss-item")
class RFRssItem extends polymer.Base {

    // The rss feed entry for this item
    @property({type: Object})
    entry: any;

    // The image shown next to the text (if any)
    @property({type: String, value: ""})
    image: String;

    // The link for the image (if any)
    @property({type: String})
    link: String;

    // The link in the content (if any)
    @property({type: String, value: ""})
    pageLink: String;

    // The firebase authentication data
    @property({type: Object})
    auth: FirebaseAuthData;

    /**
     * Register the button handler
     * @returns void
     */
    attached(): void {
        // Send "star-changed" event when the star button gets clicked
        this.$.star.addEventListener("tap", () => {
            const star: boolean = !this.entry.starred;
            this.set("entry.starred", star);
            this.fire("star-changed", this.entry);
        });
    }

    /**
     * Observer for the "entry" property. Parses the image and links from the content.
     * @param  {any} newVal The new value
     * @param  {any} oldVal The old value
     * @returns void
     */
    @observe("entry")
    _entryChanged(newVal: any, oldVal: any): void {
        if (newVal) {
            // Check if the content has an image
            const imgUrl: string[] = newVal.content.match(/src=\"(http:\/\/.+?.jpg)/);
            if (imgUrl && imgUrl.length > 1) {
                this.set("image", imgUrl[1]);
            } else {
                this.set("image", "");
            }

            // Try to find a link for the image
            const link: string[] = newVal.content.match(/<span><a href=\"(.+?)\">\[link\]<\/a><\/span>/);
            if (link && link.length > 1) {
                this.set("link", link[1]);
            } else {
                this.set("link", undefined);
            }

            // Find any link in the content
            const pageLink: string[] = newVal.content.match(/<a href=\"(.+?)\">/);
            if (pageLink && pageLink.length > 1) {
                this.set("pageLink", pageLink[1]);
            } else {
                this.set("pageLink", undefined);
            }
        }
    }

    /**
     * Returns the class name for the star button
     * @param  {boolean} starred True if the item is starred
     * @returns string The class name
     */
    _getStarClass(starred: boolean): string {
        return starred ? "starred" : "star";
    }

    /**
     * Formats the date in the entry to more readable.
     * @param  {string} date The date in the feed item
     * @returns string The human readable text for the date
     */
    _formatDate(date: string): string {
        const d: Date = new Date(date);
        const diff: number = moment(d).diff(moment());

        this.set("entry.status", Math.abs(diff) < 60 * 60 * 1000 ? "new" : "");

        return moment.duration(diff).humanize();
    }

    /**
     * Formats the content snippet.
     * @param  {string} snippet The content snippet
     * @returns string The formatted string
     */
    _formatSnippet(snippet: string): string {
        snippet = _.unescape(snippet);
        return snippet.replace('[link]', '').replace('[comments]', '');
    }
}

RFRssItem.register();
