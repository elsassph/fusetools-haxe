import haxe.extern.Rest;

@:jsRequire('FuseJS')
extern class Fuse
{
	@:native('Observable')
	@:overload(function<T>(values:Rest<T>):Observable<T>{})
	static public function observable<T>(value:Void->T):Observable<T>;
}