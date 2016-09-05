pl.ctrl.createBook = {
	initialize: function(){
		pl.ctrl.createBook.loadData();
		pl.view.createBook.setupUserInterface();
	},
	loadData: function(){
		Book.loadAll();
	}
}