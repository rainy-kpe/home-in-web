/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Card web component
 *
 * A container for the feed and title.
 */
@component("rf-card")
class RFCard extends polymer.Base {

    // The feed information
    @property({type: Object})
    feed: Feed;

    // Flag to show only the starred items
    @property({type: Boolean, value: false})
    showStarred: boolean;

    // Flag to show the settings
    @property({type: Boolean, value: false})
    showSettings: boolean;

    // The firebase instance
    _firebase: Firebase = new Firebase('https://rainfeeds-dev.firebaseio.com/feeds');

    // Token for the database save operation
    _async: any;

    // The firebase authenticate data
    _auth: FirebaseAuthData;

    /**
     * Saves the feed to the database. The saving is done with 1 sec delay after
     * the last change.
     */
    _saveToDatabase: any = () => {
        console.log(`Going to save feed "${this.feed.id}" settings to database`);
        if (this._async) {
            this.cancelAsync(this._async);
        }
        this._async = this.async(() => {
            this._async = undefined;

            if (this._auth) {
                console.log(`Saving feed "${this.feed.id}" settings to database`);
                this._firebase.child(this._auth.uid).child(this.feed.id).child("settings")
                    .set(this.feed, (error: any) => {
                    if (error) {
                        console.log('Writing the feed failed: ' + JSON.stringify(error));
                    }
                });
            }
        }, 5000);
    };

    /**
     * Registers the handlers
     * @returns void
     */
    attached(): void {
        this.$.showStarred.addEventListener("tap", () => {
            this.set("showStarred", !this.showStarred);
        });

        this.$.showSettings.addEventListener("tap", () => {
            this.set("showSettings", !this.showSettings);
        });

        this.$.closeCard.addEventListener("tap", () => {
            this.$.confirmation.toggle();
        });

        // Handle the delete button in the confirmation dialog
        this.$.confirmButton.addEventListener("tap", () => {
            this.fire("feed-deleted", this.feed);
        });

        this._firebase.onAuth((authData: FirebaseAuthData) => {
            this._auth = authData;
        });

        // Add handlers for the close buttons and input changes (triggers save to database)
        this.async(() => {
            _.map(Polymer.dom(this.root).querySelectorAll('.close'), (item: any) => {
                item.addEventListener("tap", (e: any) => {
                    this.splice("feed.urls", parseInt(item.id, 10), 1);
                });
            });

            _.map(Polymer.dom(this.root).querySelectorAll('.url'), (input: any) => {
                input.addEventListener("input", this._saveToDatabase);
            });
        });

        // Add event handler for the new url input. It adds a new url, copies the already entered
        // content to it and moves the focus the the new input control. The event handlers are also
        // added to the new input and button.
        this.$.newUrl.addEventListener("input", () => {
            if (this.feed.urls) {
                this.push("feed.urls", this.$.newUrl.value);
            } else {
                this.set("feed.urls", [this.$.newUrl.value]);
            }
            this.$.newUrl.value = "";

            // The new controls are not added immediately so make this async
            this.async(() => {
                const lastItem: any = _.last(Polymer.dom(this.root).querySelectorAll('.url'));
                if (lastItem) {
                    lastItem.focus();
                    lastItem.removeEventListener("input", this._saveToDatabase);
                    lastItem.addEventListener("input", this._saveToDatabase);
                }
                const lastButton: any = _.last(Polymer.dom(this.root).querySelectorAll('.close'));
                lastButton.addEventListener("tap", (e: any) => {
                    const id: number = parseInt(lastButton.id, 10);
                    this.set("feed.urls", _.filter(this.feed.urls, (url: string, index: number) => index !== id));
                });
            });
        });
    }

    /**
     * Observes changes in the feed. Saves the changes to database.
     * @returns void
     */
    @observe("feed.*")
    _feedChanged(): void {
        if (this._saveToDatabase) {
            this._saveToDatabase();
        }

        if (!this.feed.name) {
            this.set("showSettings", true);
        }
    }

    /**
     * Returns the name of the icon that is used in the star button
     * @param  {boolean} showStarred A flag to show/hide the starred items
     * @returns string The name of the icon in the button
     */
    _getShowStarredIcon(showStarred: boolean): string {
        return showStarred ? "icons:star" : "icons:star-border";
    }

    /**
     * Converts the HSV color to RGB
     * @param  {number} h Hue
     * @param  {number} s Saturation
     * @param  {number} v Value
     * @returns number Array of [R, G, B]
     */
    _HSVtoRGB(h: number, s: number, v: number): number[] {
        let r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
    }

    /**
     * Calculates a color for the given string
     * @param  {string} s The string
     * @returns string The color as a comma separated string
     */
    _generateColor(s: string): string {
        let val: number = 0;
        if (s) {
            val = s.split("").reduce((a: any, b: any) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
        }

        const [r, g, b]: number[] = this._HSVtoRGB((Math.abs(val) % 1000) / 1000, 1, 0.5);
        return `${r}, ${g}, ${b}`;
    }
}

RFCard.register();
