

// tag 0,id 1,class 2,text 3,type 4,for 5
function createEle(){
	// console.log(arguments)
	var txt = document.createTextNode(arguments[3]);
		var containerDiv = document.createElement(arguments[0]);
		containerDiv.id = arguments[1];
		containerDiv.name = arguments[1];
		containerDiv.className = arguments[2];
		containerDiv.type = arguments[4];
		containerDiv.for = arguments[5];
		if(arguments[3] != undefined)
			containerDiv.appendChild(txt);

		return containerDiv;

}

function genQuiz(n){

	var qID,caID,cbID,ccID,cdID;
	for (var i = 1; i <= n; i++) {
		qTit = "Question Number "+i;
		qID = 'q'+i;
		caID = 'q'+i+'a';
		cbID = 'q'+i+'b';
		ccID = 'q'+i+'c';
		cdID = 'q'+i+'d';


		var nwInf = createEle("div","","input-field"),
	 		nwinlab = createEle("label","","",qTit,"",qID),
	 		nwQinp = createEle("input",qID,"","","text");

	  	nwInf.appendChild(nwinlab);
	  	nwInf.appendChild(nwQinp);

	  	


	    var row = createEle("div","","row"),
	  		col6 = createEle("div","","col m6 l6"),
	  		col6b = createEle("div","","col m6 l6");

	  	var ifDivA = createEle("div","","input-field"),
	 		labA = createEle("label","","","A","",caID),
	 		chA = createEle("input",caID,"","","text");
	 	var ifDivB = createEle("div","","input-field"),
	 		labB = createEle("label","","","B","",cbID),
	 		chB = createEle("input",cbID,"","","text");
	 	var ifDivC = createEle("div","","input-field"),
	 		labC = createEle("label","","","C","",ccID),
	 		chC = createEle("input",ccID,"","","text");
	 	var ifDivD = createEle("div","","input-field"),
	 		labD = createEle("label","","","D","",cdID),
	 		chD = createEle("input",cdID,"","","text");


	 		ifDivA.appendChild(labA);
	 		ifDivA.appendChild(chA);
	 		ifDivB.appendChild(labB);
	 		ifDivB.appendChild(chB);
	 		ifDivC.appendChild(labC);
	 		ifDivC.appendChild(chC);
	 		ifDivD.appendChild(labD);
	 		ifDivD.appendChild(chD);



	 		col6.appendChild(ifDivA);
	 		col6.appendChild(ifDivB);
	 		col6b.appendChild(ifDivC);
	 		col6b.appendChild(ifDivD);

	 		row.appendChild(col6);
	 		row.appendChild(col6b);




	 		arguments[1].appendChild(nwInf);
	 		arguments[1].appendChild(row);
		
	}

}


/**************
 *Each questions have an id like q1,q2,q3... and so on(q+num)
 *Each choise under a certain question have an id q1a q1b q1c ... q2a q2c gebtohal becha
 *Function test() is trigerd when number of qustion is selected 
 *i guess u can do adding the data to db using save btn from the modal .. or maybe not :) 
 */



var body = document.getElementById('quizArea'),
	preQuiz = document.getElementById('preQuiz'),
	answerArea = document.getElementById('answersArea'),
	count = 0;


function test(){

	var sel = document.getElementById('noQu'),
	selValu = sel.options[sel.selectedIndex].value;
	selValu = Number(selValu);
	var newDiv = createEle("div","","animated fadeInUp");
	 genQuiz(selValu,newDiv);
	body.appendChild(newDiv);

	preQuiz.className = "hide";
	answerArea.className = "";


}

function saveIt(){
	console.log(q1,"Acadabraba");
}

	
	 
	

	


