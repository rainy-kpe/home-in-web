/// <reference path="../../../typings/browser.d.ts" />

/**
 * Hello World web component
 *
 * Displays Hello [[who]] text.
 *
 * @property {String} who Name who is helloed
 */
@component("hello-world")
class HelloWorld extends polymer.Base {
    @property({type: String, value: "World"})
    who: String;
}

HelloWorld.register();
