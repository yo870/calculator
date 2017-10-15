$(document).ready(function() {
	calculator();
});

function calculator(){
	var status = "new"; //or "continue"
	var reset = false; // for when Equal is hit. In case a number is hit right after it it must act like AC.
	var operator = "plus"; // indicates what the operator to use is on the next operation.
	var stemp = ""; // "string temp". must be use to enable to put one number after the other on display. Cannot be used for operations because is a string.
	var temp = 0; // transforms stemp into a number to use it with operations.
	var result = 0; // is the result which will be dispplayed. Is the result of itself (if many successive operations) by temp and operator.
	var actions = { //this translate which operation to apply depending on var operator.
		"plus" : function () { return result + temp;},
		"minus" : function () { return result - temp;},
		"multi" : function () { return result * temp;},
		"divide" : function () { return result / temp;},
	};
	// During each input there are 2 possible cases:
	$("button").on("click", function () {
		if (status === "new") {begin(this.value);}
		else if (status === "continue") {cont(this.value);}
		else {alert("An error has occured")}
	})
		//1. When the new input totally replaces the current display (ex: at beginning, after AC/CE, after operators). Hence "begin"
	function begin(input) {
		if (/[0-9]/.test(input)) {
			if (reset) {result = 0; temp = 0;}
			set(null,input.toString(),Number(input.toString()),input.toString(),"continue");
		} 
		else if (input === ".") {
			if (reset) {result = 0; temp = 0; }
			set(null,"0.",null,"0.","continue")
		}
		else if ( (input === "AC") || (input === "CE") ) { 
			set("plus","",0,"0",null);
			result = 0;
		}
		else {operator = input}
		reset = false;
	}
		//2. When the new input must not replace the current display but be added (additional number to already displayed numbers or operator after input numbers). Hence "continue"
	function cont(input) {
		if (/[0-9]/.test(input)) {
			if (stemp.length < 10) {
				if (stemp === "0") { // To solve case if user hit 0 as a first number (otherwise will be displayed)
					set(null,input.toString(),Number(input.toString()),input.toString(),"continue");
				} else { 
					set(null,stemp + input.toString(),Number(stemp + input.toString()),stemp + input.toString(),"continue");
				}
			}	
			else { // ensure input is not off display 
				alert("The capacity of this calculator does not allow more than 10 digits. Please try another calculation.");
				set(null,0,0,0,"new");
			}
		} 
		else if (input === ".") {
			set(null,stemp + ".",null,stemp + ".","continue");
		}
		else if (input === "AC") { 
			set("plus","",0,"0",null);
		}
		else if (input === "CE") {
			set(null,"",0,"0",null);
		} 
		else if (input === "equal") {
			operations(actions[operator]());
			set("plus","",null,result,"new");
			reset = true;
		}
		else {
			operations(actions[operator]());
			set(input,"",null,result,"new");
		}
	}

	function set(op,ste,te,di,sta) { // this performs the recurrent updates
		if (op != null) {operator = op;}
		if (ste != null) {stemp = ste;}
		if (te != null) {temp = te;}
		if (di != null) {$('#display').text(di);}
		if (sta != null) {status = sta;}
		//debugger;
	;}

	function operations(resulttemp) { //this uses the result of the object actions based on the selected operator. MathRound cuts to 2 decimal to prevent from being off display
				if ((Math.round((resulttemp) * 100) / 100).toString().length <= 10) {
					result = Math.round((resulttemp) * 100) / 100;
				} 
				else { // ensure result is not off display 
					alert("The result of this operation contains more than 10 digits. Please try another calculation.");
					set("plus","",0,"0",null);
					result = 0;
				}
	}
}; // end of funtion calculator