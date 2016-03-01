/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * WEather web component
 *
 * Displays current conditions and forecast.
 */
@component("rf-weather")
class RFWeather extends polymer.Base {

    // The weather from the feed
    @property({type: Object})
    weather: any;

    // The weather location
    @property({type: String})
    location: string;
}

RFWeather.register();
