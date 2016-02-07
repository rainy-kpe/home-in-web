/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Card area web component
 *
 */
@component("rf-card-area")
class RFCardArea extends polymer.Base {

    @property({type: Array})
    feeds: Object;

    attached(): void {
        this.set("feeds", [
            "http://www.reddit.com/.rss",
            "https://news.ycombinator.com/rss",
            "http://www.rainlendar.net/cms/index.php?option=com_kunena&Itemid=42&func=fb_rss&no_html=1",
            "http://www.tivi.fi/rss.xml",
            "http://www.aamulehti.fi/cs/Satellite?c=AMChannelFeed_C&cid=1194596264225&p=1194596117294&" +
                "pagename=KAL_newssite%2FAMChannelFeed_C%2FAMArticleFeedIngressRSS20",
            "http://www.iltalehti.fi/osastot/rss2-osastot-short20_os.xml",
            "http://feeds.afterdawn.com/afterdawn_uutiset"
        ]);
    }
}

RFCardArea.register();
