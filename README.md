# ng-cordova-ionic

AngularJS Cordova wrappers for common Cordova plugins and Ionic components.

## Inspiration

[ngCordova](https://github.com/driftyco/ng-cordova) plugin wrappers are great if you only test your app on a device.

However, for devs like me who spend most of the time testing their Ionic apps on the browser, it's necessary to have fallbacks of some plugins or at least to detect when they are not available and act accordingly.

That's the intent of this project :)

## Installation

1. Install with bower (this will install all dependencies):

`bower install ng-cordova-ionic`

2. Add to index.html

```html
<script src="bower_components/lodash/dist/lodash.compat.js"></script>
<script src="bower_components/ngCordova/dist/ng-cordova.js"></script>
<script src="bower_components/ng-cordova-ionic/dist/ng-cordova-ionic.js"></script>
```

> If you use diegonetto's [generator-ionic](https://github.com/diegonetto/generator-ionic) there is no need to add the scripts manually. You should be using it anyway, trust me :D
