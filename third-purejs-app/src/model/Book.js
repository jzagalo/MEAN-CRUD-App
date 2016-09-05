var  LanguageEL = new Enumeration({"en":"English","de":"German","fr":"French","es":"Spanish"});

var  BookCategoryEL  = new Enumeration(["novel","biography","textbook","other"]);

var  PublicationFormEL = new Enumeration(["hardcover","paperback","ePub","PDF"]);

//console.log(PublicationFormEL);

function Book( slots) {
  // assign default values
  this.isbn = "";   // string
  this.title = "";  // string
  this.originalLanguage = 0;  // number (from LanguageEL)
  this.otherAvailableLanguages = [];  // list of numbers (from LanguageEL)
  this.category = 0;  // number (from BookCategoryEL)
  this.publicationForms = [];  // list of numbers (from PublicationFormEL)
  // assign properties only if the constructor is invoked with an argument
  if (arguments.length > 0) {
    this.setIsbn( slots.isbn); 
    this.setTitle( slots.title); 
    this.setOriginalLanguage( slots.originalLanguage);
    this.setOtherAvailableLanguages(slots.otherAvailableLanguages);
    this.setCategory( slots.category);
    this.setPublicationForms( slots.publicationForms);
  }
};
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
	if(constraintViolation instanceof NoConstraintViolation){
		if(!id){
      Book.displayInfo('Invalid ISBN. Valid ISBN must 9 Numbers appended with an X' + '<br/>');
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
	
	var validationResult = Book.checkIsbnAsId(id);
	if(validationResult instanceof NoConstraintViolation){
		this.isbn = id;
	}else{
		throw validationResult;
	}
}
Book.checkTitle = function (t) {
  if (!t) {
    Book.displayInfo('A title must be provided!' + '<br/>');
    return new MandatoryValueConstraintViolation("A title must be provided!");
  } else if (!util.isNonEmptyString(t)) {
    Book.displayInfo('The title must be a non-empty string!' + '<br/>');
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
  Book.checkOriginalLanguage = function (l) {
  if (l === undefined) {
    return new MandatoryValueConstraintViolation(
        "An original language must be provided!");
  } else if (!Number.isInteger( l) || l < 1 || l > LanguageEL.MAX) {
    return new RangeConstraintViolation("Invalid value for original language: "+ l);
  } else {
    return new NoConstraintViolation();
  }
};
Book.prototype.setOriginalLanguage = function (l) {
  var constraintViolation = Book.checkOriginalLanguage( l);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.originalLanguage = l;
  } else {
    throw constraintViolation;
  }
};

Book.checkOtherAvailableLanguage = function (oLang) {

  if (!Number.isInteger( oLang) || oLang < 1 || oLang > LanguageEL.MAX) {
    return new RangeConstraintViolation(
        "Invalid value for other available language: "+ oLang);
  } else {
    return new NoConstraintViolation();
  }
};
Book.checkOtherAvailableLanguages = function (oLangs) {
	console.log(oLangs);
  var i=0, constraintViolation=null;
  if (oLangs == undefined || (Array.isArray( oLangs) && oLangs.length === 0)) {
    return new NoConstraintViolation();  // optional
  } else if (!Array.isArray( oLangs)) {
    return new RangeConstraintViolation(
        "The value of otherAvailableLanguages must be a array!");
  } else {
    for (i=0; i < oLangs.length; i++) {
      constraintViolation = Book.checkOtherAvailableLanguage( oLangs[i]);
      if (!(constraintViolation instanceof NoConstraintViolation)) {
        return constraintViolation;
      }
    }
    return new NoConstraintViolation();
  }
};
Book.prototype.setOtherAvailableLanguages = function (oLangs) {
  var constraintViolation = Book.checkOtherAvailableLanguages( oLangs);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.otherAvailableLanguages = oLangs;
  } else {
    throw constraintViolation;
  }
};

Book.checkCategory = function (c) {
  if (c === undefined || isNaN(c)) {
    return new MandatoryValueConstraintViolation(
        "A category must be provided!");
  } else if (!Number.isInteger( c) || c < 1 || c > BookCategoryEL.MAX) {
    return new RangeConstraintViolation("Invalid value for category: "+ c);
  } else {
    return new NoConstraintViolation();
  }
};
Book.prototype.setCategory = function (c) {
  var constraintViolation = Book.checkCategory( c);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.category = c;
  } else {
    throw constraintViolation;
  }
};

Book.checkPublicationForm = function (p) {
  if (p == undefined) {
    return new MandatoryValueConstraintViolation(
        "No publication form provided!");
  } else if (!Number.isInteger( p) || p < 1 || p > PublicationFormEL.MAX) {
    return new RangeConstraintViolation(
        "Invalid value for publication form: "+ p);
  } else {
    return new NoConstraintViolation();
  }
};
Book.checkPublicationForms = function (pubForms) {
  var i=0, constraintViolation=null;
  if (pubForms == undefined || (Array.isArray( pubForms) && pubForms.length === 0)) {
    return new MandatoryValueConstraintViolation(
        "No publication form provided!");
  } else if (!Array.isArray( pubForms)) {
    return new RangeConstraintViolation(
        "The value of publicationForms must be a array!");
  } else {
    for (i=0; i < pubForms.length; i++) {
      constraintViolation = Book.checkPublicationForm( pubForms[i]);
      if (!(constraintViolation instanceof NoConstraintViolation)) {
        return constraintViolation;
      }
    }
    return new NoConstraintViolation();
  }
};
Book.prototype.setPublicationForms = function (pubForms) {
  var constraintViolation = Book.checkPublicationForms( pubForms);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.publicationForms = pubForms;
  } else {
    throw constraintViolation;
  }
};
/*********************************************************
***  Other Instance-Level Methods  ***********************
**********************************************************/
/**
 *  Serialize book object 
 */
Book.prototype.toString = function () {
  return "Book{ ISBN:"+ this.isbn +", title:"+ this.title + 
    ", originalLanguage:"+ this.originalLanguage +
    ", otherAvailableLanguages:"+ this.otherAvailableLanguages.toString() +
    ", category:"+ this.category +
	  ", publicationForms:"+ this.publicationForms.toString() +"}"; 
};


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
 			console.log('entered');
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
 		Book.displayInfo(keys.length + " books loaded.");
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
 		Book.displayInfo("Error when writing to Local Storage\n" + e);
 		error = true;
 	}
 	if(!error) Book.displayInfo(nmrOfBooks + " books saved.");
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
		if(book.originalLanguage !== slots.originalLanguage){
		  book.setOriginalLanguage(slots.originalLanguage);
		  updatedProperties.push("originalLanguage");

		}
    if(!book.otherAvailableLanguages.isEqualTo(slots.otherAvailableLanguages)){
      book.setOtherAvailableLanguages(slots.otherAvailableLanguages);
      updatedProperties.push("otherAvailableLanguages");
    }
		if(!book.publicationForms.isEqualTo(slots.publicationForms)){
      book.setPublicationForms(slots.publicationForms);
      updatedProperties.push("publicationForms");
    }
    if(book.category !== (slots.category)){
      book.setCategory(slots.category);
      updatedProperties.push("category");
    }
	 }catch(e){
	 	console.log(e.name + ": " + e.message);
	 	NoConstraintViolated = false;

	 	// restore object to its state before updating
	 	Book.instances[slots.isbn] = objectBeforeUpdate;
	 }
	 if(NoConstraintViolated){
	 	if(updatedProperties.length > 0){
	 		Book.displayInfo('Properties '+ updatedProperties.toString() +
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
    console.log(book);
		Book.instances[slots.isbn] = book;
		console.log(Book.instances);

	}catch(e){
		console.log(e.name + ": " + e.message);
		book = null;
	}
	if(book){	
		
		  Book.displayInfo(book.toString() + " created!");		
    }
}

Book.destroy = function(isbn){
	if(Book.instances[isbn]){
		Book.displayInfo("Book " + isbn + " deleted");
		delete Book.instances[isbn];
		Book.saveAll();
	}else{
		console.log('There is no book with ISBN '
			+isbn + " in the database");
	}
}

Book.createTestData = function () {
  try {
    Book.instances["006251587X"] = new Book({isbn:"006251587X", title:"Weaving the Web",  
        originalLanguage:LanguageEL.EN, otherAvailableLanguages:[ LanguageEL.DE, LanguageEL.FR], 
        category:BookCategoryEL.NOVEL, publicationForms:[PublicationFormEL.EPUB,PublicationFormEL.PDF]});
    Book.instances["0465026567"] = new Book({isbn:"0465026567", title:"Gödel, Escher, Bach", 
        originalLanguage:LanguageEL.DE, otherAvailableLanguages:[LanguageEL.FR], 
        category:BookCategoryEL.OTHER, publicationForms:[PublicationFormEL.PDF]});
    Book.instances["0465030793"] = new Book({isbn:"0465030793", title:"I Am A Strange Loop", 
        originalLanguage:LanguageEL.EN, otherAvailableLanguages:[LanguageEL.ES], 
        category:BookCategoryEL.TEXTBOOK, publicationForms:[PublicationFormEL.EPUB]});
 
    Book.saveAll();
    console.log(Book.instances);
   
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
  }
};

Book.clearData = function(){
	if(confirm("Do you really want to delete allthe book data?")){
		localStorage.setItem("bookTable","{}");
	}
}

Book.displayInfo = function(data){
	var display = document.getElementById('display');
	if(display)	{
		if(display.innerHTML !== '' ){
			display.style.display = 'none';
			display.innerHTML = '';
		}
		display.style.display = 'block';
		display.innerHTML = data;
	}
  if(Object.keys(Book.instances).length === 0){
    if(display)
      display.style.display = 'none';
  }
	
}