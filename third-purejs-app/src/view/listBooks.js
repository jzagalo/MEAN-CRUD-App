pl.view.listBooks = {
	setupUserInterface: function (){
		var tableBodyEl = document.querySelector("table#books>tbody");
		Book.loadAll();
		var i = 0, book = null, key='', row={}, keys = Object.keys(Book.instances);			

		// For each book, createa table row with a cell for each attribute
		for (i= 0; i < keys.length; i++){
			key = keys[i];
			
			book = Book.instances[key];
			row = tableBodyEl.insertRow(-1);
			row.insertCell(-1).textContent = book.isbn;

			row.insertCell(-1).textContent = book.title;

			row.insertCell(-1).textContent =
								LanguageEL.labels[book.originalLanguage-1];

			row.insertCell(-1).textContent =
								LanguageEL.convertEnumIndexes2Names(
									book.otherAvailableLanguages);
			row.insertCell(-1).textContent =
								BookCategoryEL.labels[book.category-1];
			row.insertCell(-1).textContent =
								PublicationFormEL.convertEnumIndexes2Names(
									book.publicationForms);		
				

		}

	}

};