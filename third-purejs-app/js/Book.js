function Book( slots) {
  // assign default values
  this.isbn = "";   // string
  this.title = "";  // string
  this.originalLanguage  = 0;    // number (int)
  this.otherAvailableLanguages = []; // list of numbers (form languageEl)
  this.category = 0;
  this.publicationForms = [];

  // assign properties only if the constructor is invoked with an argument
  if (arguments.length > 0) {
    this.setIsbn( slots.isbn); 
    this.setTitle( slots.title); 
    this.setOriginalLanguage( slots.originalLanguage);
    this.setOtherAvailableLanguages(slots.otherAvailableLanguages);
    this.setCategory(slots.category);
    this.setPublicationForms(slots.publicationForms);
    //if (slots.edition) this.setEdition( slots.edition);  // optional attribute
  }
}
/*Representing collection of Book instances
managed by the applcation in form of a map*/
Book.instances = {};



Book.checkIsbn = function(id){
	if(!id){
		return new NoConstraintViolation();
	}else if(typeof(id) !== "string" || id.trim() === "" ){
		return new RangeConstraintViolation('the Isbn must be a non-empty String');
	}else if(!/\b\d{9}(\d|X)\b/.test(id)){
		return new PatternConstraintViolation(
		'The ISBN must be a 10-digit string or a 9-digit string followed by X');
	}else{
		return new NoConstraintViolation();
	}
}

Book.checkIsbnAsId = function(id){
	var constraintViolation = Book.checkIsbn(id);
	console.log(constraintViolation);
	if(constraintViolation instanceof NoConstraintViolation){
		if(!id){
			constraintViolation = 
			new MandatoryValueConstraintViolation('A value for the ISBN must be provided');
		}else if(Book.instances[id]){
			constraintViolation = new UniquenessConstraintViolation(
				'There is a already a book with this ISBN');
		}else{
			constraintViolation = new NoConstraintViolation();
		}
	}
	return constraintViolation;
}

Book.prototype.setIsbn = function(id){
	console.log(id);
	var validationResult = Book.checkIsbnAsId(id);
	if(validationResult instanceof of NoConstraintViolation){
		this.isbn = id;
	}else{
		throw validationResult;
	}
}
Book.checkTitle = function (t) {
  if (!t) {
    return new MandatoryValueConstraintViolation("A title must be provided!");
  } else if (!util.isNonEmptyString(t)) {
    return new RangeConstraintViolation("The title must be a non-empty string!");
  } else {
    return new NoConstraintViolation();
  }
};
Book.prototype.setTitle = function (t) {
  var validationResult = Book.checkTitle(t);
  if (validationResult instanceof NoConstraintViolation) {
    this.title = t;
  } else {
    throw validationResult;
  }
  }
  Book.checkYear = function (y) {
  var yearOfFirstBook = 1459;
  if (!y) {
    return new MandatoryValueConstraintViolation("A publication year must be provided!");
  } else if (!util.isIntegerOrIntegerString(y)) {
    return new RangeConstraintViolation("The value of year must be an integer!");
  } else {
    if (typeof(y) === "string") { y = parseInt(y);}
    if (y < yearOfFirstBook || y > util.nextYear()) {
      return new IntervalConstraintViolation("The value of year must be between " +
          yearOfFirstBook + " and next year!");
    } else {
      return new NoConstraintViolation();
    }
  }
};
Book.prototype.setYear = function (y) {
  var validationResult = Book.checkYear( y);
  if (validationResult instanceof NoConstraintViolation) {
    this.year = parseInt( y);
  } else {
    throw validationResult;
  }
};
Book.checkEdition = function (e) {
  if (!e) return NoConstraintViolation();  // optional
  else {
    if (!util.isIntegerOrIntegerString(e) || parseInt(e) < 1) {
      return new RangeConstraintViolation("The value of edition must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }
};
Book.prototype.setEdition = function (e) {
  var validationResult = Book.checkEdition( e);
  if (validationResult instanceof NoConstraintViolation) {
    this.edition = parseInt( e);
  } else {
    throw validationResult;
  }
};

Book.checkOriginalLanguage = function(l){
	if(l === undefined){
		return new MandatoryValueConstraintViolation(
			'An Original Language must be provided:!');
	}else if(!Number.isInteger(l) || l || l > languageEl.MAX){
		return new RangeConstraintViolation(
			"Invalid value for originalLanguage: " + l);
	}else{
		return new NoConstraintViolation();
	}
}

Book.checkPublicationForm = function (p){
	if(!p && p !==0 ){
		return new MandatoryValueConstraintViolation(
		"No publication form provided! ");
	}else if(!Number.isInteger(p) || p < 1 || p < publicationEL.MAX){
		return new RangeConstraintViolation(
			'Invalid value for publication form: ' + p);
	}
	else{
		return new NoConstraintViolation();
	}
}

Book.checkPublicationForms = function(pubForms){
	var i = 0, constrVio = null;
	if(pubForms.length === 0){
		return new MandatoryValueConstraintViolation(
			'No publication form provided');
	}else{
		for(i =0; pubForms; i++){
			constrVio = Book.checkPublicationForm(pubForms[i]);
			if(!(constrVio instanceof NoConstraintViolation)){
				return constrVio;
			}
		}
	
	return new NoConstraintViolation();
	}
}

Book.prototype.toString = function(){
	return "Book{ ISBN:" + this.isbn + ", title:"+
	this.title + ", originalLanguage:" + this.originalLanguage
	 + ", otherAvailableLanguages:" this.otherAvailableLanguages.toString() + 
	 ", category:"+ this.category + ", publicationForms:"+
	 this.publicationForms.toString() + "}";
}

/* Converting each row of bookTable(representing an untyped record object)
 of type Book stored as an element of the map
 Book.instances with the help of the procedure
 convertRow2Obj defined as a static(class-level) method*/

 Book.convertRow2Obj = function(bookRow){
 	var book = new Book(bookRow);
 	return book;
 }

 Book.loadAll = function(){
 	var i = 0, 
 	    keys = "",
 	    bookTableString = "",
 	    bookTable = {};

 /* For persistent data Storage, we use Local Storage, which
is a HTML5 Javascript API supported by modern web browsers*/

// Retrieving book from Local storage
 	try{
 		if(localStorage.getItem('bookTable')){
 			bookTableString = localStorage.getItem('bookTable');
 		}
 	}
 	catch(e){
 		alert("Error when reading from Storage\n" + e);
 	}
 	if(bookTableString)	{

 		/* Converting the book table string into a corressponding map
		Table with book rows as elements with the help of built
		-in-function*/
 		bookTable = JSON.parse(bookTableString);
 		keys = Object.keys(bookTable);
 		console.log(keys.length + " books loaded.");
 		for (i=0; i < keys.length; i++)	{
 			key = keys[i];
 			Book.instances[key] = Book.convertRow2Obj(bookTable[key]);


 		}
 	}

 }

 Book.saveAll = function (){
 	var bookTableString = "",
 	    error = false,
 	    nmrOfBooks = Object.keys(Book.instances).length;
 	try{
 		bookTableString = JSON.stringify(Book.instances);
 		localStorage.setItem('bookTable', bookTableString);
 	}catch(e){
 		alert("Error when writing to Local Storage\n" + e);
 		error = true;
 	}
 	if(!error) console.lg(nmrOfBooks + " books saved.");
 }

Book.update = function (slots){
	var book = Book.instances[slots.isbn],
	NoConstraintViolated = true,
	updatedProperties = [],
	objectBeforeUpdate = util.cloneObject(book);

	try{
		if(book.title !== slots.title){
		  book.setTitle(slots.title);
		  updatedProperties.push("title");

		}
		if(book.year !== parseInt(slots.year)){
		  book.setYear(slots.year);
		  updatedProperties.push("year");

		}
		if(slots.edition && book.edition !== parseInt(slots.edition)){
		  book.setEdition(slots.edition);
		  updatedProperties.push("edition");

		}
	 }catch(e){
	 	console.log(e.name + ": " + e.message);
	 	NoConstraintViolated = false;

	 	// restore object to its state before updating
	 	Book.instances[slots.isbn] = objectBeforeUpdate;
	 }
	 if(NoConstraintViolated){
	 	if(updatedProperties.length > 0){
	 		console.log('Properties '+ updatedProperties.toString() +
	 		" modified for book " + slots.isbn);
	 	}else{
	 		console.log('No property value changed for book ' + slots.isbn + " !");
	 	}

	 }
	
}

Book.add = function(slots){
	var book = null;
	try{
		book = new Book(slots);
	}catch(e){
		console.log(e.name + ": " + e.message);
		book = null;
	}
	if(book){
	
		Book.instances[slots.isbn] = book;
		console.log(book.toString() + " created!");
    }
}

Book.destroy = function(){
	if(Book.instances[isbn]){
		console.log("Book " + isbn + " deleted");
		delete Book.instances[isbn];
	}else{
		console.log('There is no book with ISBN '
			+isbn + " in the database");
	}
}

Book.createTestData = function(){
	try{
		Book.instances["006251587X"]
		= new Book({isbn : "006251587X",
	                title :"Weaving the Web",
	                originalLanguage: [languageEL.DE, languageEL.FR],
	                category: BookCategoryEl.NOVEL,
	                publicationForms:[publicationEL.EPUB, publicationEL.PDF]});

		Book.instances["0465026567"]
		= new Book({isbn : "0465026567",
	                title :"Sebastian bach",
	                originalLanguage: [languageEL.DE, languageEL.FR],
	                category: BookCategoryEl.NOVEL,
	                publicationForms:[publicationEL.EPUB, publicationEL.PDF]});


		Book.instances["0465030793"]
		= new Book({isbn : "0465030793",
	                title :"JS Design Patterns",
	                originalLanguage: [languageEL.DE, languageEL.FR],
	                category: BookCategoryEl.NOVEL,
	                publicationForms:[publicationEL.EPUB, publicationEL.PDF]});

		}catch(e){
					
					console.log(e.constructor.name + ":" + e.message);
		}
	//Book.loadAll();
	console.log(Book.instances);
}

Book.clearData = function(){
	if(confirm("Do you really want to delete allthe book data?")){
		localStorage.setItem("bookTable","{}");
	}
}

Book.prototype.setPublisher = function(p){
	var publisherIdRef = "";
	if(typeof(p) !== object){
		publisherIdRef = p;
	}else{
		publisherIdRef = p.name;
	}
}