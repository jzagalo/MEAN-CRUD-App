pl.view.updateBook = {
	/*
	*	Initialise the updateBook form
	*/
	setupUserInterface: function () {
		var formEl = document.forms['Book'],
			origLangSelEl = formEl.originalLanguage,
			otherAvailLangSelEl = formEl.otherAvailableLanguages,
			categoryFieldsetEl = formEl.querySelector(
				"fieldset[data-bind='category']"),
			pubFormsFieldsetEl = formEl.querySelector(
				"fieldset[data-bind='publicationForms']"),
			saveButton = formEl.commit,
			selectBookEl = formEl.selectBook;
		   // set up the book selection list
		   Book.loadAll();
		
		util.fillSelectWithOptions(selectBookEl, Book.instances,
			{key:"isbn", displayProp:"title"});
		
		/* when a book is selected, populate the form
		populate the form with the book*/
		selectBookEl.addEventListener('change', function(){ 
		var book = null, bookKey = selectBookEl.value;
		if(bookKey){

			book = Book.instances[bookKey];
			console.log(book.publicationForms);
			formEl.isbn.value = book.isbn;
			formEl.title.value = book.title;
			formEl.originalLanguage.value = book.originalLanguage;

			// Setup the publication forms selection list
			util.fillSelectWithOptions( otherAvailLangSelEl, 
            LanguageEL.labels, {selection: book.otherAvailableLanguages});

            //set up the category radio button group
             util.createChoiceWidget(categoryFieldsetEl, "category", 
            [book.category] , "radio", BookCategoryEL.labels);

	        // set up the publicationForms checkbox group
	        util.createChoiceWidget(pubFormsFieldsetEl, "publicationForms", 
	        book.publicationForms, "checkbox", PublicationFormEL.labels);

		}else{
			formEl.reset();			
		}
	    });
	
		// set up the book language selection list
        util.fillSelectWithOptions(origLangSelEl, LanguageEL.labels);

        //add event listeners for responsive validation      
	   
	   formEl.title.addEventListener('input', function(){
	   		formEl.title.setCustomValidity(
	   			Book.checkTitle( formEl.title.value).message);
	   });

	   origLangSelEl.addEventListener('input', function(){
	   		origLangSelEl.setCustomValidity(
	   			(!origLangSelEl.value) ? 'A value must be selected!':'');
	   });
	    // mandatory value check
	   categoryFieldsetEl.addEventListener('click', function(){
	   		formEl.category[0].setCustomValidity(
	   		(!categoryFieldsetEl.getAttribute("data-value")) ? 
	   		      'A value must be selected!':'');
	   });
	    // mandatory value check
    	pubFormsFieldsetEl.addEventListener("click", function () {
        var val = pubFormsFieldsetEl.getAttribute("data-value");
        formEl.publicationForms[0].setCustomValidity( 
          (!val || Array.isArray(val) && val.length === 0) ? 
              "At least one publication form must be selected!":"" );
   		 });

	   saveButton.addEventListener('click', handleSubmitButtonClickEvent);
	   formEl.addEventListener('submit',function(){
			e.preventDefault();
			formEl.reset();
		});
	   window.addEventListener('beforeunload', function(){
	   		Book.saveAll();
	   });

	   

	   //save updated data
	   function  handleSubmitButtonClickEvent(){
		var formEl = document.forms['Book'],
        selectedOtherAvLangOptions = formEl.otherAvailableLanguages.selectedOptions,
        categoryFieldsetEl = formEl.querySelector("fieldset[data-bind='category']"),
        pubFormsFieldsetEl = formEl.querySelector("fieldset[data-bind='publicationForms']");
    var slots = { isbn: formEl.isbn.value, 
          title: formEl.title.value,
          originalLanguage: parseInt( formEl.originalLanguage.value),
          otherAvailableLanguages: [],
          category: parseInt( categoryFieldsetEl.getAttribute("data-value")),
          publicationForms: JSON.parse( pubFormsFieldsetEl.getAttribute("data-value"))
    };
	    // construct the list of selected otherAvailableLanguages 
	    for (i=0; i < selectedOtherAvLangOptions.length; i++) {
	      slots.otherAvailableLanguages.push( 
	          parseInt( selectedOtherAvLangOptions[i].value));
	    }
	    // set error messages in case of constraint violations
	    formEl.title.setCustomValidity( Book.checkTitle( slots.title).message);
	    formEl.originalLanguage.setCustomValidity( Book.checkOriginalLanguage( 
	        slots.originalLanguage).message);
	    formEl.otherAvailableLanguages.setCustomValidity( 
	        Book.checkOtherAvailableLanguages( slots.otherAvailableLanguages).message);
	    formEl.category[0].setCustomValidity( 
	        Book.checkCategory( slots.category).message);
	    formEl.publicationForms[0].setCustomValidity( 
	        Book.checkPublicationForms( slots.publicationForms).message);
	    if (formEl.checkValidity()) {
	      Book.update( slots);
	    }
	  }
		}

	
};