pl.view.deleteBook = {
	setupUserInterface: function (){
		var formEl = document.forms['Book'],
			deleteButton = formEl.commit,
			selectBookEl = formEl.selectBook;

		Book.loadAll();
		// set up the book selection list
		util.fillSelectWithOptions(selectBookEl, Book.instances, {keyProp:"isbn", displayProp:"title"});
		deleteButton.addEventListener('click', function(){
			var isbn = selectBookEl.value;
			if(isbn){

				Book.destroy(isbn);
				selectBookEl.remove(selectBookEl.selectedIndex);
			}
		});
		// take care of saving data when the app is closed 
       window.addEventListener("beforeunload", function() {
        Book.saveAll(); 
    });
	
		
	}
	
	
};