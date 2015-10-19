package ux;

import Fuse.*;
import fuse.Observable;
import fuse.UXExport;
import store.TodoStore;

class MainView implements UXExport
{
	public var titleInput = observable('Enter task here');
	public var todoList:Observable<Task>;
	public var canClearCompleted:Observable<Bool>;
	public var remainingText:Observable<String>;
	
	var currentTab = observable(Tab.All);
	var store:TodoStore;
	var remainingCount:Observable<Int>;
	
	function new()
	{
		store = new TodoStore(currentTab);
		todoList = store.list;
		
		remainingCount = store.list.count(function(task) {
			return task.checked.not();
		});
		remainingText = remainingCount.map(function(n) {
			return '$n ${n == 1 ? "task" : "tasks"} remaining';
		});
		
		canClearCompleted = store.list.count(function(task) {
			return task.checked;
		}).map(function(total) {
			return total > 0;
		});
	}
	
	/* TABS */
	
	public function showAll()
	{
		currentTab.value = Tab.All;
	}
	
	public function showActive()
	{
		currentTab.value = Tab.Active;
	}
	
	public function showCompleted()
	{
		currentTab.value = Tab.Completed;
	}
	
	/* ITEMS */
	
	public function addItem(_)
	{
		store.addItem(titleInput.value);
		titleInput.value = 'Enter task here';
	}
	
	public function deleteItem(e)
	{
		store.deleteItem(e.data);
	}
	
	public function toggleAll(_)
	{
		var hasRemaining = remainingCount.value > 0;
		store.setAllChecked(hasRemaining);
	}
	
	public function toggleItem(e)
	{
		store.toggleItem(e.data);
	}
	
	public function clearCompleted(_)
	{
		store.clearCompleted();
	}
}