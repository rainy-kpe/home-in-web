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
    feed: any;

    // Flag to show only the starred items
    @property({type: Boolean, value: false})
    showStarred: boolean;

    /**
     * Registers the button handler
     * @returns void
     */
    attached(): void {
        this.$.showStarred.addEventListener("tap", () => {
            this.set("showStarred", !this.showStarred);
        });
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
        const val: any = s.split("").reduce((a: any, b: any) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);

        const [r, g, b]: number[] = this._HSVtoRGB((Math.abs(val) % 1000) / 1000, 1, 0.5);
        return `${r}, ${g}, ${b}`;
    }
}

RFCard.register();
