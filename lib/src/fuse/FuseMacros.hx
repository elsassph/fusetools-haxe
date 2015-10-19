package fuse;

import haxe.macro.Context;
import haxe.macro.Expr.Field;
import haxe.macro.Expr.Access;
import haxe.macro.Expr.FieldType;
import haxe.macro.Expr;

class FuseMacros
{
	static public function autoBind()
	{
		// lookup public functions and constructor
		var fields:Array<Field> = Context.getBuildFields();
		var toBind = [];
		var ctor:Field;
		for (field in fields)
		{
			if (field.name == 'new') 
			{
				ctor = field;
				continue;
			}
			var acc = field.access;
			if (acc.indexOf(Access.APublic) >= 0 && acc.indexOf(Access.AStatic) < 0)
			{
				switch (field.kind) {
					case FieldType.FFun(f):
						toBind.push(field);
					default:
				}
			}
		}
		
		if (ctor == null) Context.error('Type does not have a constructor', Context.currentPos());
		
		// pre-bind public functions so that scope is maintained when Fuse callbacks are invoked
		switch(ctor.kind)
		{
			case FieldType.FFun(f):
				switch (f.expr.expr)
				{
					case EBlock(exprs):
						//
						for (field in toBind)
						{
							field.access.push(Access.ADynamic);
							exprs.push( macro $i{field.name} = $i{field.name} );
						}
					default:
				}
			default:
		}
		return fields;
	}
}