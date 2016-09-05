pl.view.createBook = {
	
	setupUserInterface: function(){
		var formEl = document.forms['Book'],
			 origLangSelEl = formEl.originalLanguage,
        otherAvailLangSelEl = formEl.otherAvailableLanguages,
        categoryFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='category']"),
        pubFormsFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='publicationForms']"),
        submitButton = formEl.commit;

        Book.loadAll();
	    // set up the originalLanguage selection list
	    util.fillSelectWithOptions( origLangSelEl, LanguageEL.labels);
	    // set up the otherAvailableLanguages selection list
	    util.fillSelectWithOptions( otherAvailLangSelEl, LanguageEL.labels);
	    // set up the category radio button group
	    util.createChoiceWidget( categoryFieldsetEl, "category", [], 
	        "radio", BookCategoryEL.labels);
	    // set up the publicationForms checkbox group
	    util.createChoiceWidget( pubFormsFieldsetEl, "publicationForms", [], 
	        "checkbox", PublicationFormEL.labels);
	    // add event listeners for responsive validation
	    formEl.isbn.addEventListener("input", function () { 
	        formEl.isbn.setCustomValidity( 
	            Book.checkIsbnAsId( formEl.isbn.value).message);
	    });
	    formEl.title.addEventListener("input", function () { 
	        formEl.title.setCustomValidity( 
	            Book.checkTitle( formEl.title.value).message);
	    });
	    // simplified validation: check only mandatory value
	    origLangSelEl.addEventListener("change", function () {
	      origLangSelEl.setCustomValidity( 
	          (!origLangSelEl.value) ? "A value must be selected!":"" );
	    });
    // mandatory value check not needed for other avail. lang. 
	/*
    otherAvailLangSelEl.addEventListener("change", function () {
      otherAvailLangSelEl.setCustomValidity( 
          (otherAvailLangSelEl.selectedOptions.length === 0) ? 
              "At least one value must be selected!":"" );
    });
	*/
    // mandatory value check
    categoryFieldsetEl.addEventListener("click", function () {
      formEl.category[0].setCustomValidity( 
          (!categoryFieldsetEl.getAttribute("data-value")) ? 
              "A category must be selected!":"" );
    });
    // mandatory value check
    pubFormsFieldsetEl.addEventListener("click", function () {
      var val = pubFormsFieldsetEl.getAttribute("data-value");
      formEl.publicationForms[0].setCustomValidity( 
          (!val || Array.isArray(val) && val.length === 0) ? 
              "At least one publication form must be selected!":"" );
    });
    submitButton.addEventListener("click", handleSubmitButtonClickEvent);
    // neutralize the submit event
    formEl.addEventListener( 'submit', function (e) { 
        e.preventDefault();;
        formEl.reset();
    });
	     window.addEventListener('beforeunload', function()
		{  			
			Book.saveAll();
		});
        
	    function  handleSubmitButtonClickEvent (){
    	var i=0, formEl = document.forms['Book'],
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
	    formEl.isbn.setCustomValidity( Book.checkIsbnAsId(slots.isbn).message);
	    formEl.title.setCustomValidity( Book.checkTitle(slots.title).message);
	    formEl.originalLanguage.setCustomValidity( Book.checkOriginalLanguage( 
	        slots.originalLanguage).message);
	    formEl.otherAvailableLanguages.setCustomValidity( 
	        Book.checkOtherAvailableLanguages(slots.otherAvailableLanguages).message);
	    formEl.category[0].setCustomValidity( 
	        Book.checkCategory(slots.category).message);
	    formEl.publicationForms[0].setCustomValidity( 
	        Book.checkPublicationForms(slots.publicationForms).message);
	    // save the input data only if all form fields are valid
	    if (formEl.checkValidity()) {
	      	Book.add(slots);
	        Book.displayInfo( slots.title + ' was successfully added');
	        formEl.reset();
	    }
	  }
}




















		/*var slots = {
			 isbn: formEl.isbn.value,
		     title: formEl.title.value,
		     year: formEl.year.value,
		     edition: formEl.edition.value
		 };
		 console.log(slots);
		//set error messages in case of constraint violations
		var errString = '';
		if(Book.checkIsbnAsId(slots.isbn).message !== ''){
			errString += Book.checkIsbnAsId(slots.isbn).message + '<br>';
		}
	    if(Book.checkTitle(slots.title).message !== ''){
			errString += Book.checkTitle(slots.title).message + '<br>';
		}
		if(Book.checkYear(slots.year).message !== ''){
			errString += Book.checkYear(slots.year).message + '<br>';
		}
		if(Book.checkEdition(slots.edition).message !== ''){
			errString += Book.checkEdition(slots.edition).message;
		}
		

		formEl.isbn.setCustomValidity(Book.checkIsbnAsId(slots.isbn).message);
		formEl.title.setCustomValidity(Book.checkTitle(slots.title).message);
		formEl.year.setCustomValidity(Book.checkYear(slots.year).message);
		formEl.edition.setCustomValidity(Book.checkEdition(slots.edition).message);

		if(formEl.checkValidity()){
			Book.add(slots);
			Book.saveAll();

		}else{
			document.getElementById('display').innerHTML = errString;
		}
	}
	}*/
	
};