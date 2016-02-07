/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Card web component
 *
 */
@component("rf-card")
class RFCard extends polymer.Base {

    @property({type: String})
    feed: String;

    _HSVtoRGB(h: number, s: number, v: number): any {
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
