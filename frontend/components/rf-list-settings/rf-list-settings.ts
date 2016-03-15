/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * List web component
 *
 * The settings for different feed types
 */
@component("rf-list-settings")
class RFListSettings extends polymer.Base {

    // The feed item
    @property({type: Object, notify: true})
    feed: Feed;

    /**
     * Checks if the feed is given type
     * @param  {string} feedType The feed's type
     * @param  {string} type The type to check for
     * @returns true, if the feed is given type
     */
    _isFeedType(feedType: string, type: string): boolean {
        return type === feedType;
    }

    _getTitle(feedType: string): string {
        if (feedType === "rss") {
            return "Feeds";
        }
        if (feedType === "youtube") {
            return "Playlists";
        }
        return "";
    }

    _getPlaceholderText(feedType: string): string {
        if (feedType === "rss") {
            return "Add new rss feed url";
        }
        if (feedType === "youtube") {
            return "Add new playlist (ID)";
        }
        return "";
    }

    /**
     * Registers the handlers
     * @returns void
     */
    attached(): void {
        // Add handlers for the close buttons
        this.async(() => {
            // Add handler for the existing close buttons
            _.map(Polymer.dom(this.root).querySelectorAll('.close'), (item: any) => {
                item.addEventListener("tap", (e: any) => {
                    this.splice("feed.urls", parseInt(item.id, 10), 1);
                });
            });

            // Add handler for the input controls
            _.map(Polymer.dom(this.root).querySelectorAll('.url'), (item: any) => {
                item.addEventListener("input", (e: any) => this.fire("settings-changed"));
            });

            // Add event handler for the new url input. It adds a new url, copies the already entered
            // content to it and moves the focus the the new input control. The event handlers are also
            // added to the new input and button.
            const input: HTMLInputElement = <HTMLInputElement> Polymer.dom(this.root).querySelector('#newUrl');
            if (input) {
                input.addEventListener("input", () => {
                    if (this.feed.urls) {
                        this.push("feed.urls", input.value);
                    } else {
                        this.set("feed.urls", [input.value]);
                    }
                    input.value = "";

                    this.async(() => {
                        // Move the focus to the newly created input control
                        const lastItem: any = _.last(Polymer.dom(this.root).querySelectorAll('.url'));
                        if (lastItem) {
                            lastItem.addEventListener("input", (e: any) => this.fire("settings-changed"));
                            lastItem.focus();
                        }
                        // Add tap handler for the close button
                        const lastButton: any = _.last(Polymer.dom(this.root).querySelectorAll('.close'));
                        lastButton.addEventListener("tap", (e: any) => {
                            const id: number = parseInt(lastButton.id, 10);
                            this.splice("feed.urls", id, 1);
                        });
                    });
                });
            }
        }, 2000);
    }
}

RFListSettings.register();
