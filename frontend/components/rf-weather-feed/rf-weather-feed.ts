/// <reference path="../../../typings/browser.d.ts" />
"use strict";

/**
 * Weather Feed web component
 *
 * Downloads the weather conditions from Yahoo Weather.
 */
@component("rf-weather-feed")
class RFWeatherFeed extends polymer.Base {

    // The weather location contents
    @property({type: String})
    location: string;

    // The resulting feed
    @property({type: Object, notify: true})
    result: any;

    // Token for the database fetch operation
    _async: any;

    @observe("location")
    _locationChanged(newVal: any, oldVal: any): void {
        this._fetch();
    }

    _parseResult: any = (result: any) => {
        const condition: any = result.query.results.channel.item.condition;
        const weather: Weather = {
            current: {
                temp: condition.temp,
                icon: "wi-yahoo-" + condition.code,
                text: condition.text
            },
            forecast: []
        };

        const forecast: any[] = result.query.results.channel.item.forecast;
        forecast.map((cast: any) => {
            weather.forecast.push({
                low: cast.low,
                high: cast.high,
                text: cast.text,
                day: cast.day,
                icon: "wi-yahoo-" + cast.code
            });
        });

        this.set("result", weather);
    };

    _fetch(): void {
        if (this._async) {
            this.cancelAsync(this._async);
        }
        this._async = this.async(() => {
            this._async = undefined;

            if (this.location) {
                // console.log(`Reading weather feed for ${this.location}`);
                const url: string = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
                                    'select * from weather.forecast where woeid in (select woeid from ' +
                                    'geo.places(1) where text="' + _.escape(this.location) + '") and u="c"';

                const request: any = new XMLHttpRequest();
                request.onload = () => { this._parseResult(JSON.parse(request.responseText)); };
                request.open("get", url, true);
                request.send();

                this.async(() => this._fetch(), 60 * 60 * 1000);
            }
        }, 1000);
    };
}

RFWeatherFeed.register();
