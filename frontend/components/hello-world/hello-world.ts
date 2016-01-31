/// <reference path="../../../typings/browser.d.ts" />

@component("hello-world")
class HelloWorld extends polymer.Base {
    @property({type: String, value: "World"})
    who: String;
}

HelloWorld.register();
