/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * List Item web component
 *
 * A single item of the feed. Handles starring and unstarring.
 */
@component("rf-list-item")
class RFListItem extends polymer.Base {

    // The feed entry for this item
    @property({type: Object})
    item: any;

    // The firebase authentication data
    @property({type: Object})
    auth: FirebaseAuthData;

    // The flag for new items
    @property({type: String})
    newFlag: string;

    /**
     * Register the button handler
     * @returns void
     */
    attached(): void {
        // Send "star-changed" event when the star button gets clicked
        this.$.star.addEventListener("tap", () => {
            const star: boolean = !this.item.starred;
            this.set("item.starred", star);
            this.fire("star-changed", this.item);
        });
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
        const d: Date = new Date(<any> _.toNumber(date) || date);
        const diff: number = moment(d).diff(moment());

        this.set("newFlag", Math.abs(diff) < 60 * 60 * 1000 ? "new" : "");

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

RFListItem.register();
