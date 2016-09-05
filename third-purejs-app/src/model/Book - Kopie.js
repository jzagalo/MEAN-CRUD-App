/*Book Model Class with slots object with properties
 isbn,title,year*/
function Book (slots){
	//assign default values
	this.isbn = "";
	this.title = "";
	this.year = "";
	//assign properties only if the constructor is invoked with an anrgument
	if(arguments.length > 0){
		this.setIsbn = slots.isbn;
		this.setTitle = slots.title;
		this.setYear = slots.year;
		if(slots.edition) this.setEdition(slots.edition);
	}

}
/*Representing collection of Book instances
managed by the applcation in form of a map*/
Book.instances = {};


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
 		console.log(bookTable);
 		//Book.displayInfo(keys.length + " books loaded.");
 		for (i=0; i < keys.length; i++)	{
 			key = keys[i]; 		    
 			Book.instances[key] = Book.convertRow2Obj(bookTable[key]);
 		}
 	}
   document.getElementById('display').style.display = 'none';
 }

 Book.saveAll = function (){
 	var bookTableString = "",
 	    error = false,
 	    nmrOfBooks = Object.keys(Book.instances).length;
 	    console.log(nmrOfBooks);
 	try{
 		bookTableString = JSON.stringify(Book.instances);
 		localStorage.setItem('bookTable', bookTableString);
 	}catch(e){
 		alert("Error when writing to Local Storage\n" + e);
 		error = true;
 	}
 	if(!error) Book.displayInfo(nmrOfBooks + " books saved.");
 }

Book.update = function (slots){
	var book = Book.instances[slots.isbn];
	var year = parseInt(slots.year);
	if(book.title !== slots.title){
		book.title = slots.title;
	}
	if(book.year !== year){ 
	    book.year = year;
	}
	Book.displayInfo("Book " + slots.isbn + " modified!");
}

Book.add = function(slots){
	console.log('here');
	var book = Book.instances[slots.isbn];
	Book.instances[slots.isbn] = new Book(slots);
	console.log(Book.instances);
	Book.displayInfo("Book " + slots.isbn + " created!");
	Book.saveAll();
}

Book.destroy = function(isbn){
	if(Book.instances[isbn]){
		console.log("Book " + isbn + " deleted");
		delete Book.instances[isbn];
		Book.saveAll();
	}else{
		console.log('There is no book with ISBN '
			+isbn + " in the database");
	}
}

Book.createTestData = function(){
	var keys = ["006251587X","0465026567","0465030793"];
	Book.instances[keys[0]]
	= new Book({isbn : "006251587X",
                title :"Weaving the Web",
                year: 2000});

	Book.instances[keys[1]]
	= new Book({isbn : "0465026567",
                title :"Sebastian bach",
                year: 1999});

	Book.instances[keys[2]]
	= new Book({isbn : "0465030793",
                title :"JS Design Patterns",
                year: 2005});
   localStorage.setItem("bookTable", JSON.stringify(Book.instances)); 
}

Book.clearData = function(){
	if(confirm("Do you really want to delete allthe book data?")){
		Book.instances = {};
		localStorage.setItem("bookTable","{}");
	}

}
Book.displayInfo = function(data){
	var display = document.getElementById('display');
	if(display.innerHTML !== ''){
		//display.style.display = 'none';
		display.innerHTML = '';
	}
	display.style.display = 'block';
	display.innerHTML = data;
	
}