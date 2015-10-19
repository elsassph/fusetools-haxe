package store;

import Fuse.*;
import fuse.Observable;

enum Tab {
	All;
	Active;
	Completed;
}

class TodoStore
{
	public var list:Observable<Task>;
	
	var currentTab:Observable<Tab>;
	
	public function new(currentTab) 
	{
		this.currentTab = currentTab;
		list = observable();
	}
	
	public function addItem(title:String) 
	{
		var checked = observable(false);
		var hidden = observable(function() {
			return switch(currentTab.value)
			{
				case Tab.All: false;
				case Tab.Active: checked.value;
				case Tab.Completed: !checked.value; 
			}
		});
		var task = {
			title: title,
			checked: checked,
			hidden: hidden
		}
		list.add(task);
	}

	public function toggleItem(task:Task) 
	{
		if (list.contains(task))
			task.checked.value = !task.checked.value;
	}
	
	public function deleteItem(task:Task)
	{
		if (list.contains(task))
			list.remove(task);
	}
	
	public function setAllChecked(state:Bool) 
	{
		list.forEach(function(x) {
			x.checked.value = state;
		});
	}
	
	public function clearCompleted() 
	{
		list.removeWhere(function(x) return x.checked.value);
	}
}

typedef Task = {
	var title:String;
	var checked:Observable<Bool>;
	var hidden:Observable<Bool>;
}