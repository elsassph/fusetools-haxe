var console = Function("return typeof console != 'undefined' ? console : {log:function(){}}")();
var $estr = function() { return js_Boot.__string_rec(this,''); };
var App = function() { };
App.__name__ = true;
App.main = function() {
	module.exports = { MainView : ux_MainView};
};
var Fuse = require("FuseJS");
Math.__name__ = true;
var UXExport = function() { };
UXExport.__name__ = true;
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var store_Tab = { __ename__ : true, __constructs__ : ["All","Active","Completed"] };
store_Tab.All = ["All",0];
store_Tab.All.toString = $estr;
store_Tab.All.__enum__ = store_Tab;
store_Tab.Active = ["Active",1];
store_Tab.Active.toString = $estr;
store_Tab.Active.__enum__ = store_Tab;
store_Tab.Completed = ["Completed",2];
store_Tab.Completed.toString = $estr;
store_Tab.Completed.__enum__ = store_Tab;
var store_TodoStore = function(currentTab) {
	this.currentTab = currentTab;
	this.list = Fuse.Observable();
};
store_TodoStore.__name__ = true;
store_TodoStore.prototype = {
	addItem: function(title) {
		var _g = this;
		var checked = Fuse.Observable(false);
		var hidden = Fuse.Observable(function() {
			var _g1 = _g.currentTab.value;
			switch(_g1[1]) {
			case 0:
				return false;
			case 1:
				return checked.value;
			case 2:
				return !checked.value;
			}
		});
		var task = { title : title, checked : checked, hidden : hidden};
		this.list.add(task);
	}
	,toggleItem: function(task) {
		if(this.list.contains(task)) task.checked.value = !task.checked.value;
	}
	,deleteItem: function(task) {
		if(this.list.contains(task)) this.list.remove(task);
	}
	,setAllChecked: function(state) {
		this.list.forEach(function(task) {
			task.checked.value = state;
		});
	}
	,clearCompleted: function() {
		this.list.removeWhere(function(task) {
			return task.checked.value;
		});
	}
};
var ux_MainView = function() {
	this.currentTab = Fuse.Observable(store_Tab.All);
	this.titleInput = Fuse.Observable("Enter task here");
	this.store = new store_TodoStore(this.currentTab);
	this.todoList = this.store.list;
	this.remainingCount = this.store.list.count(function(task) {
		return task.checked.not();
	});
	this.remainingText = this.remainingCount.map(function(n) {
		return "" + n + " " + (n == 1?"task":"tasks") + " remaining";
	});
	this.canClearCompleted = this.store.list.count(function(task1) {
		return task1.checked;
	}).map(function(total) {
		return total > 0;
	});
	this.showAll = $bind(this,this.showAll);
	this.showActive = $bind(this,this.showActive);
	this.showCompleted = $bind(this,this.showCompleted);
	this.addItem = $bind(this,this.addItem);
	this.deleteItem = $bind(this,this.deleteItem);
	this.toggleAll = $bind(this,this.toggleAll);
	this.toggleItem = $bind(this,this.toggleItem);
	this.clearCompleted = $bind(this,this.clearCompleted);
};
ux_MainView.__name__ = true;
ux_MainView.__interfaces__ = [UXExport];
ux_MainView.prototype = {
	showAll: function() {
		this.currentTab.value = store_Tab.All;
	}
	,showActive: function() {
		this.currentTab.value = store_Tab.Active;
	}
	,showCompleted: function() {
		this.currentTab.value = store_Tab.Completed;
	}
	,addItem: function(_) {
		this.store.addItem(this.titleInput.value);
		this.titleInput.value = "Enter task here";
	}
	,deleteItem: function(e) {
		this.store.deleteItem(e.data);
	}
	,toggleAll: function(_) {
		var hasRemaining = this.remainingCount.value > 0;
		this.store.setAllChecked(hasRemaining);
	}
	,toggleItem: function(e) {
		this.store.toggleItem(e.data);
	}
	,clearCompleted: function(_) {
		this.store.clearCompleted();
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
App.main();
