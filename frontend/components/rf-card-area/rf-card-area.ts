/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Card area web component
 *
 */
@component("rf-card-area")
class RFCardArea extends polymer.Base {

    @property({type: Array})
    feeds: any;

    attached(): void {
        this.set("feeds", [{
                title: "Reddit",
                urls: ["http://www.reddit.com/.rss"]
            }, {
                title: "HackerNews",
                urls: ["https://news.ycombinator.com/rss"]
            }, {
                title: "Rainlendar",
                urls: ["http://www.rainlendar.net/cms/index.php?option=com_kunena&Itemid=42&func=fb_rss&no_html=1"]
            }, {
                title: "TiVi",
                urls: ["http://www.tivi.fi/rss.xml"]
            }, {
                title: "Aamulehti",
                urls: ["http://www.aamulehti.fi/cs/Satellite?c=AMChannelFeed_C&cid=1194596264225&p=1194596117294&" +
                "pagename=KAL_newssite%2FAMChannelFeed_C%2FAMArticleFeedIngressRSS20"]
            }, {
                title: "Iltalehti",
                urls: ["http://www.iltalehti.fi/osastot/rss2-osastot-short20_os.xml"]
            }, {
                title: "Afterdawn",
                urls: ["http://feeds.afterdawn.com/afterdawn_uutiset"]
            }, {
                title: "Twit.tv",
                urls: ["http://feeds.twit.tv/aaa_video_hd.xml",
                       "http://feeds.twit.tv/ww_video_hd.xml",
                       "http://feeds.twit.tv/mbw_video_hd.xml",
                       "http://feeds.twit.tv/tnss_video_hd.xml"]
            }, {
                title: "Dev Blogs",
                urls: ["http://blog.polymer-project.org/feed.xml",
                       "https://blogs.msdn.microsoft.com/typescript/feed/",
                       "http://feeds.feedburner.com/TheJavascriptPlayground",
                       "https://javascriptweblog.wordpress.com/feed/",
                       "http://feeds.feedburner.com/2ality"]
            }
        ]);
    }
}

RFCardArea.register();
