# Haxe for FuseTools

[FuseTools](https://www.fusetools.com/) is a new, promising, tool for crossplatform/mobiles apps development.

Application scripting is done in JavaScript, and one of the remarkable aspects of FuseTools is
that it is strongly based on [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) and [reactive programming](https://en.wikipedia.org/wiki/Reactive_programming). The result of this 
combination is the `Observable` object which combines those naturally/magically.

Of course you normally have to rely on your brain alone in JavaScript to leverage this crazy 
reactive programming approach. Unless you use Haxe to have strong typing!

**Attention: proof-of-concept ahead**

## Haxe?

Haxe is a superb strongly typed language which can fit as well heavy-weight single-page
applications but also distributed/reactive code as FuseTools applications.

Here's my attempt to convince myself (and maybe you) that the Haxe compiler and type system can bring a lot of 
value to Fuse projects: it's fun to play with JavaScript, but how do you control the integrity of your projects
when they will have grown past the Poc size?

## Observable

The [Observable](https://www.fusetools.com/learn/fusejs#-observable-s) API is really rich and 
challenging to describe in Haxe, especially the fact that an `Observable` is not instantiated 
with the `new` keyword:

```javascript
var Observable = require('FuseJS/Observable');

var who = Observable('World');

var hello = Observable(function() {
	return "Hello " + who.value;
});

module.exports = {
	hello: hello
}

// UX can bind `hello` and will update automatically whenever `who`'s value change!!!
```

Haxe doesn't like that so we have to have a slightly different approach, but it looks quite nice in the end:

```haxe
import Fuse.observable;

class View {
	var who = observable('World'); // Observable<String>
	public var hello:Observable<String>;
	
	public function new() {
		hello = observable(function() {
			return "Hello ${who.value}';
		});
	}
}

module.exports = new View();
```

**It may look like syntaxic sugar, but it's way more than that**: this is fully strongly typed. Everything 
is validated by the compiler and guarranteed to be sound before running it. 

## module.exports

Normally Fuse scripting is "distributed": each view has its little inline script or requires an
external JS for the view. 

Each view script should expose observables and callbacks through a `module.exports`object 
(see previous point about Observables).

It is possible however to have shared code between views:

```xml
<JavaScript File="app.js" ux:Global="app" />
<JavaScript>
	var app = require('app');
	module.exports = new app.MainView();
</JavaScript> 
```

`app.js` would be Haxe generated, and to expose these view scripts we can write:

```haxe
class App {
	static function main() {
		untyped module.exports = {
			MainView: MainView
		};
	}
}
```

**TODO: there should be a nice way to automate that**

## Callbacks

A Fuse UX view can bind actions to script callbacks. 

The problem is that for some reason those functions are called out of scope, but there's a 
macro for that ;)

```haxe
class MainView implements UXExport {
	var currentTab = observable(Tab.All);
	/*...*/	
	public function showAll() {
		currentTab.value = Tab.All; // this.currentTab
	}
	/*...*/	
}

module.exports = new MainView();
```

If the `showAll` function was just exposed as a function of the `MainView` instance, you'd 
discover that the scope is lost when the function is invoked. 

The solution is to implement `UXExport` which will run a macro pre-binding all the public functions
to the instance so that scope will be correct when the method is called by the view. 
