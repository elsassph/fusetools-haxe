import haxe.extern.Rest;

extern class Observable<T>
{
	public var length:Int;
	public var value:T;
	
	public function new(values:Rest<T>);
	
	public function getAt(index:Int):T;
	public function add(value:T):Void;
	public function remove(value:T):Void;
	public function tryRemove(value:T):Bool;
	public function removeWhere(func:T->Bool):Void;
	public function forEach(func:T->Void):Void;
	public function replaceAt(index:Int, value:T):Void;
	public function replaceAll(values:Array<T>):Void;
	public function clear():Void;
	public function indexOf(value:T):Int;
	public function contains(value:T):Bool;
	
	public function where(func:T->Bool):Observable<T>;
	public function map<U>(func:T->U):Observable<U>;
	public function count(?func:T->Observable<Bool>):Observable<Int>;
	public function not():Observable<Bool>;
	public function filter(func:T->Bool):Observable<T>;
	public function expand():Dynamic; // TODO hard one...
	
	public function addSubscriber(func:Observable<T>->Void):Void;
	public function removeSubscriber(func:Observable<T>->Void):Void;
	
	public function toString():String;
}
