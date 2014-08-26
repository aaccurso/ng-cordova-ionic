# ng-cordova-ionic

Wrappers for ngCordova services with Ionic fallbacks.

## Inspiration

[ngCordova](https://github.com/driftyco/ng-cordova) plugin wrappers are great if you only test your app on a device.

However, for devs like me who spend most of the time testing their Ionic apps on the browser, it's necessary to have fallbacks for some plugins or at least detect when they are not available and act accordingly.

That's the intent of this project :)

## Installation

- Install with bower (this will download all dependencies):

`bower install ng-cordova-ionic -S`

> `-S` to add as dependency to bower.json

- Add to index.html

```html
<script src="bower_components/lodash/dist/lodash.compat.js"></script>
<script src="bower_components/ngCordova/dist/ng-cordova.js"></script>
<script src="bower_components/ng-cordova-ionic/dist/ng-cordova-ionic.js"></script>
```

- Add as dependency in your angular module:

```javascript
angular.module('myApp', ['ngCordovaIonic']);
```

> If you are working with diegonetto's [generator-ionic](https://github.com/diegonetto/generator-ionic) there is no need to add the scripts manually.

> You should be using it anyway, trust me :D

## Demo

You can check some of the wrappers usage at [Demo ngCordovaIonic](https://github.com/aaccurso/ng-cordova-ionic/tree/master/demo).
