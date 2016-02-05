/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Rss Feed web component
 *
 */
@component("rf-rss-feed")
class RFRssFeed extends polymer.Base {

    @property({type: String})
    feed: Object;

    @property({type: Object})
    result: any;

    @property({type: Object, notify: true})
    title: any;

    /**
     * Observer for the feed changes. Parses the content.
     */
    @observe("result")
    _resultChanged(newVal: any, oldVal: any): void {
        if (newVal) {
            this.title = newVal.title;
        }
    }
}

RFRssFeed.register();
