function Enumeration(enumArg){

	var i = 0, lbl = ''; LBL = "";
	if(Array.isArray(enumArg)){
		if(!enumArg.every(function(n){
				return (typeof(n) === "string"); 

			})){
			throw new OtherConstraintViolation(
			"A list of Enumeration labels must be an array of strings");
		}
		this.labels = enumArg;		
		this.enumLitNames = this.labels;
		this.codeList = null;

	}else if (typeof(enumArg) === "object" && Object.keys(enumArg).length > 0){
            console.log(enumArg + '-obj');
			// a code list defined by a map
			if(!Object.keys(enumArg).every(function(code){

				return (typeof(enumArg[code]) === "string");
				 })){
				throw new OtherConstraintViolation(
				"All values of a code list map must be strings");
			}

			this.codeList = enumArg;
			// use the codes as the names of enumeration literals
			this.enumLitNames = Object.keys(this.codeList);
			this.labels = this.enumLitNames.map(function(c){
				//console.log(enumArg[c] + " ("+ c + ")");

				return enumArg[c] + " ("+ c + ")";

			});

	}
	else{
		throw new OtherConstraintViolation('Invalid Enumeration constructor argument ' + enumArg);
	}
	
	this.MAX = this.enumLitNames.length;

	//generate the enumaration literals by capitalizing/normalizing
	for(var i= 1; i <= this.MAX; i++){
		// replace " " and '-' with "_"
		//console.log(this.enumLitNames[i-1]);
		lbl = this.enumLitNames[i - 1].replace(/( |-)/g, '_');
		//convert to array of words, capitalize them and re-convert
		LBL = lbl.split('_').map(function(lblPart){
			return lblPart.toUpperCase();
		}).join('_');
		
		//LBL = String(LBL);
		//console.log(LBL);
		this[LBL] = i;

		//console.log(this);

		
	}
	Object.freeze(this);

}

Enumeration.prototype.convertEnumIndexes2Names = function(a){
	var listStr = a.map( function (enumInt) { 
                  return this.enumLitNames[enumInt-1];}, this).join(", "); 
  return listStr;
}


//var PublicationFormEL = new Enumeration(["hardcover", "paperback", "ePub", "PDF"]);
//var LanguageEL = new Enumeration({ "en": "English", "de": "German", "fr":"French", "es": "Spanish"});