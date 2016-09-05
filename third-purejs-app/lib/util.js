/**
 * @fileOverview  Defines utility procedures/functions   
 * @author Gerd Wagner
 */
var util = {
 /**
  * Verifies if a value represents an integer
  * @param {number} x
  * @return {boolean}
  */
  isNonEmptyString: function (x) {
    return typeof(x) === "string" && x.trim() !== "";
  },
 /**
  * Return the next year value (e.g. if now is 2013 the function will return 2014)
  * @return {number}  the integer representing the next year value
  */
  nextYear: function () {
    var date = new Date();
    return (date.getFullYear() + 1);
  }, 
 /**
  * Verifies if a value represents an integer or integer string
  * @param {string} x
  * @return {boolean}
  */
  isIntegerOrIntegerString: function (x) {
    return typeof(x) === "number" && x.toString().search(/^-?[0-9]+$/) == 0 ||
        typeof(x) === "string" && x.search(/^-?[0-9]+$/) == 0;
  },
 /**
  * Creates a clone of a data record object or extracts the data record part of an object
  * @param {object} obj
  */
  cloneRecord: function (obj) {
    var record = null;
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && typeof obj[p] != "object") {
        record[p] = obj[p];
      }
    }   
    return record;
  },
 /**
  * Creates a typed "data clone" of an object
  * Notice that Object.getPrototypeOf(obj) === obj.__proto__ 
  * === Book.prototype when obj has been created by new Book(...)
  * @param {object} obj
  */
  cloneObject: function (obj) {
    var p= "", val,
    clone = Object.create( Object.getPrototypeOf(obj));
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        val = obj[p];
        if(typeof val === "number" ||
          typeof val === "string" ||
          typeof val === "boolean" ||
          val instanceof Date ||

          //typed object reference
          typeof val === "object" && !!val.constructor ||

          //list of data values
          Array.isArray(val) && !val.some(function(el){
            return typeof el === "object";
          }) ||
          // list of typed object reference
          Array.isArray(val) &&
          val.every(function(el){
            return (typeof val === "object" && !!val.constructor)
          })
        ){
          if(Array.isArray(val)) clone[p] = val.slice(0);
          else clone[p] = val;
        }
      }
    }
    return clone;
  },
  /**
   * Create option elements from an associative array of objects
   * and insert them into a selection list element
   *
   * @param {object} aa  An associative array of objects
   * @param {object} selList  A select(ion list) element
   * @param {string} keyProp  The standard identifier property
   * @param {string} displayProp [optional]  A property supplying the text 
   *                 to be displayed for each object
   */

   createOption: function(val, txt, classValues){
    var el = document.createElement('option');
    el.value = val;
    el.text = txt;
    if(classValues) el.className = classValues;
    return el;
   },

  fillSelectWithOptions: function (selectEl, selectionRange, optPar) {
    var optionEl = null, options= "", obj=null, key="", displayProp="", i=0;
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    if(!selectEl.multiple){
      selectEl.add(util.createOption("", " --- "));
    }
    // create option elements from object property values
 
    options = Array.isArray(selectionRange) ? selectionRange : Object.keys(selectionRange);
  
    for(i=0; i < options.length; i++){
      if(Array.isArray(selectionRange)){
        optionEl = util.createOption(i+ 1, options[i]);
         //    console.log(optionEl);
        if(selectEl.multiple && optPar && optPar.selection &&
          optPar.selection.includes(i+1)){
          optionEl.selected = true;
        } 
      }else{
          key = options[i];         
          obj = selectionRange[key]; 
          if(!selectEl.multiple) obj.index = i+1; //selection list index
          if(optPar && optPar.displayProp)
            displayProp = optPar.displayProp;
          else
            displayProp = optPar.key;
          optionEl = util.createOption(key, obj[displayProp]);
          //if invoked with a selection argument. flag the selected options
          if(selectEl.multiple && optPar && optPar.selection &&
            optPar.selection[key]){
            optionEl.selected = true;
          }

          
      } 
      selectEl.add(optionEl);
    } 
  
  },
  /**
   * Create a choice widget in a given fieldset element.
   * A choice element is either an HTML radio button or an HTML checkbox.
   * @method 
   */

   createChoiceWidget: function(containerEl, fld, value, choiceWidgetType, choiceItems){
          var j = 0, el = null,
              choiceControls = containerEl.querySelectorAll("#field");
              console.log(choiceControls);
          //remove old content
        
          if(choiceControls.length > 0){
            for(j = 0; j < choiceControls.length; j++){
                //var doc =  choiceControls[j].parentElement;
               containerEl.removeChild(choiceControls[j]);
            }
          }
          if(!containerEl.hasAttribute("data-bind")){
            containerEl.setAttribute("data-bind", fld);
          }

          if(value.length >= 1){
            if(choiceWidgetType === "radio"){
              containerEl.setAttribute("data-value", value[0]);
            }else{
              containerEl.setAttribute("data-value", "[" + value.join() + "]");
            }
          }

          for (j = 0; j < choiceItems.length; j++){
            el = util.createLabeledChoiceControl(choiceWidgetType, fld,
              j+1, choiceItems[j]);
            

            //check the radiobutton or checkbox
            if(value.includes(j+1))            
              el.firstElementChild.firstElementChild.checked = true;  
              //console.log(el.firstElementChild);           
              containerEl.appendChild(el);           
              el.firstElementChild.firstElementChild.addEventListener('click', function(e){
                  var btnEl = e.target, i = 0, values = [];
                  console.log(e.target);

                    if(choiceWidgetType === "radio"){
                        if(containerEl.getAttribute("data-value") !== btnEl.value){
                          containerEl.setAttribute("data-value", btnEl.value);
                        }else{
                          btnEl.checked = false;
                          containerEl.setAttribute("data-value", "");
                        }
                  }else if(choiceWidgetType === "checkbox") {
                  // checkbox
                    values = JSON.parse(containerEl.getAttribute("data-value")) || [];
                    i = values.indexOf(parseInt(btnEl.value));
                    if(i > -1){
                      values.splice(i, 1); // delete from value list
                    }else{
                      values.push(btnEl.value);
                    }
                    containerEl.setAttribute("data-value", "["+ values.join() + "]");
                  }
              });
          }
          return containerEl;
   } ,
    /**
   * Create a radio button or checkbox element
   */
   createLabeledChoiceControl: function (t,n,v,lbl) {
     var ccEl = document.createElement("input"),
               fieldDiv = document.createElement('div'),
               innerDiv = document.createElement('div'),
               factor = (t === "radio") ? "checkbox": '',
         lblEl = document.createElement("label");

     ccEl.type = t;
     ccEl.name = n;
     ccEl.value = v;
     ccEl.setAttribute('tabindex', '0');
     //ccEl.className = "hidden";
     fieldDiv.className = 'field';
     fieldDiv.id = 'field';

     innerDiv.className = 'ui ' + t +' ' + factor;
     lblEl.appendChild( document.createTextNode( lbl));
     innerDiv.appendChild(ccEl);
     innerDiv.appendChild(lblEl);
     fieldDiv.appendChild(innerDiv);
     
     return fieldDiv;
   }    

};
