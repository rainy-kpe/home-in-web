/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Card area web component
 *
 */
@component("rf-card-area")
class RFCardArea extends polymer.Base {

    @property({type: Array})
    cards: Object;

    attached(): void {
        this.set("cards", [1, 2, 3, 4]);
    }
}

RFCardArea.register();
