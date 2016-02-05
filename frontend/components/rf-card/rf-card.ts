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
}

RFCard.register();
