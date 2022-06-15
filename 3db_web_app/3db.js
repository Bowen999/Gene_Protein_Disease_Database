//0.GENERAL
var couchdb = 'http://localhost:5984/';
var database = '';

function wsurl(database,request) {
  return couchdb + database + request;
};

var skip = 0;
var page = 20;
var sort = [{"_id": "asc"}]
var term = "";

function keypress(ele,event) {
   term = ele.value;
   skiptozero();
   return true;
};

function change(ele) {
	term = ele.value;
	skiptozero();
}

function addtopskip(value) {
   skip += value;
   renderproteins();
}

function skiptopzero() {
   skip =  0;
   renderproteins();
}

function addtodskip(value) {
   skip += value;
   renderdisease();
}

function skitodzero() {
   skip =  0;
   renderdisease();
}

function addtosskip(value) {
   skip += value;
   rendersnp();
}

function skiptoszero() {
   skip =  0;
   rendersnp();
}



function db(func){
	func
}

//1.PROETIN
//1.1PROTEIN_GET
function getpname(doc){
	return doc.protein_name;
}

function getpsnp(doc){
	return doc.dbSNP;
}

function getpentry(doc,withlink=true){
	var pentry = "";
	if (withlink) {
		pentry += "<A href=\"#\" onclick=\"renderprotein(this.text);\">";
	}
	pentry += doc.protein_entry;
	if (withlink) {
		pentry += "</A></td>";
	}
	return pentry;
}

function getpmass(doc){
	return doc.mass;
}
function getpactivity(doc){
	return doc.catalytic_activity;
}

function getpgene(doc){
	return doc.gene;
}


/*
//1.2PROETIN_SORT
function psort(header){
	var thekey = "_id";
	if (header.innerHTML == "Entry"){
		thekey = "protein_entry"
	}
		if (sort.length == 0 || sort[0][thekey] != "asc") {
		sort = [{[thekey]: "asc"}];
	} else {
		sort = [{[thekey]: "desc"}];
	}
	skiptopzero();
}

function protein_sorttable(header) {
	var thekey = "_id";
	if (header.innerHTML == "Entry") {
	    thekey = "protein_entry";
	} else if (header.innerHTML == "Name") {
	    thekey = "protein_name";
	}
	if (sort.length == 0 || sort[0][thekey] != "asc") {
		sort = [{[thekey]: "asc"}];
	} else {
		sort = [{[thekey]: "desc"}];
	}
	skiptopzero();
}
*/


//1.3PROTEIN_LIST_VIEW
function renderproteins() {
  //var criteria = {"selector": {},sort "limit": 20, "skip": skip};
  var criteria = {"selector":{}, "limit":(page+1), "skip":skip};
  	if (term != ""){
		var caseinsensitiveterm = "(?i)"+term;       //(?i) turns on case-insensitivity mode
	criteria["selector"] = {"$or":[{"protein_entry":{"$regex":caseinsensitiveterm}},
		{"protein_name":{"$regex":caseinsensitiveterm}} 
	]};
	}
  json_ws_post(wsurl('protein','/_find'),criteria,function(data) {
    var table = "<table>";
	table += "<tr>";
	table += "<th onclick=\"psort(this)\">Index</th>";
	table += "<th>Entry</th>";
	table += "<th>Name</th>";
	table += "</tr>";
	
	
	for (var i = 0; i < Math.min(data.docs.length,page); i++ ) {
	  table += "<tr valign=\"top\">";
	  table += "<td width=\"50px;\">";
	  table += (i+skip+1);
	  table += "</td>";
	 
	  table += "<td>";
	  table += getpentry(data.docs[i]);
	  table += "</td>";
	  
	  table += "<td>";
	  table += getpname(data.docs[i]);
	  table += "</td>";
	  
	  table += "</tr>";
	}


	table += "</table>";

	table += "<div style=\"float:right;\"><P>";
	var needsep = false;
	if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptopzero();\">Beginning</A>";
	  table += " - <A href=\"#\" onclick=\"addtopskip(-page);\">Previous</A>";
	  needsep = true;
	}
	if (data.docs.length > page) {
	  if (needsep) {
		table += " - ";
	  }
	  table += "<A href=\"#\" onclick=\"addtopskip(page);\">Next</A>";
   	}
	table += "</P></div>"
    document.getElementById('container').innerHTML = table;
	document.getElementById('search').className = "show";
  });
  return true;
}


//1.4PROTEIN_DETAILED_VIEW
function renderprotein(entry) {
  var criteria = {"selector": {"protein_entry": entry}, "limit": 1};
  json_ws_post(wsurl('protein','/_find'),criteria,function(data) {
	//console.log(data);
  var table = "<table>";
	table += "<tr><th>Entry</th><td>";
	table += getpentry(data.docs[0],false);
	table += "</td></tr>"; 
 
	table += "<tr><th>Protein Name</th><td>";
	table += getpname(data.docs[0]);
	table += "</td></tr>"; 
  
	table += "<tr><th>Mass</th><td>";
	table += getpmass(data.docs[0]); 
	table += "</td></tr>"
	
	table += "<tr><th>Genes</th><td>";
	if(getpgene(data.docs[0]).length>0){
		table += getpgene(data.docs[0])}
	else{table += "nif";}
	table += "</td></tr>"

	table += "<tr><th>SNPs</th><td>";
	if(data.docs[0].dbSNP.length>0){
		table += "<table>";
		table += "<tr><th>Index</th><th>SNPs Accession</th></tr>";
		for (var i = 0; i < data.docs[0].dbSNP.length; i++ ) {
		table +="<tr>";
		table += "<td>" + (i+1) + "</td>";
		table += "<td onclick=\"snp_detail(this.text);\" >" + data.docs[0].dbSNP[i]+ "</td>";
		table += "</tr>";
	}
	table += "</table>";
	}
	else{table += "No information.";}
	table += "</td></tr>"

	table += "<tr><th>Disease</th><td>";
	if(data.docs[0].disease.length>0){
		table += "<table>";
		table += "<tr><th>Index</th><th>Diseas Abb</th><th>OMIM ID</th></tr>";
		for (var i = 0; i < data.docs[0].disease.length; i++ ) {
		table +="<tr>";
		table += "<td>" + (i+1) + "</td>";
		table += "<td>" + data.docs[0].disease[i].abb+ "</td>";
		table += "<td onclick=\"snp_detail(this.text);\">" + data.docs[0].disease[i].mim_id+ "</td>";
		table += "</tr>";
	}
	table += "</table>";
	}
	else{table += "No information.";}
	table += "</td></tr>"

	
	table += "</table>";
	table += "<P align=\"right\"><A href=\"#\" onclick=\"renderproteins();\">Return</A></P>"
  document.getElementById('container').innerHTML = table;
	document.getElementById('search').className = "hide";
  });
}
//********************************************************************************************






//********************************************************************************************
//2.DISEASE
//2.1DISEASE_GET
function getdmim_id(doc,withlink=true){
	var dmim = "";
	if (withlink) {
		dmim += "<A href=\"#\" onclick=\"disease_detail(this.text);\">";
	}
	dmim += doc.mim_id;
	if (withlink) {
		dmim += "</A></td>";
	}
	return dmim;
}
function getabb(doc){
	return doc.abb;
}
function getddisease(doc){
	return doc.disease;
}

function getdsnp(doc){
	return doc.dbSNP;
}

function getdprotein(doc){
	return doc.protein;
}





//2.2DISEASE_SORT
function psort(header){
	var thekey = "_id";
	if (header.innerHTML == "Entry"){
		thekey = "protein_entry"
	}
		if (sort.length == 0 || sort[0][thekey] != "asc") {
		sort = [{[thekey]: "asc"}];
	} else {
		sort = [{[thekey]: "desc"}];
	}
	skiptopzero();
}

function protein_sorttable(header) {
	var thekey = "_id";
	if (header.innerHTML == "Entry") {
	    thekey = "protein_entry";
	} else if (header.innerHTML == "Name") {
	    thekey = "protein_name";
	}
	if (sort.length == 0 || sort[0][thekey] != "asc") {
		sort = [{[thekey]: "asc"}];
	} else {
		sort = [{[thekey]: "desc"}];
	}
	skiptopzero();
}



//2.3DISEASE_LIST_VIEW
function renderdisease() {
  //var criteria = {"selector": {},sort "limit": 20, "skip": skip};
  var criteria = {"selector":{}, "limit":(page+1), "skip":skip};
  	if (term != ""){
		var caseinsensitiveterm = "(?i)"+term;       //(?i) turns on case-insensitivity mode
	criteria["selector"] = {"$or":[{"mim_id":{"$regex":caseinsensitiveterm}},
		{"disease":{"$regex":caseinsensitiveterm}}, {"abb":{"$regex":caseinsensitiveterm}}
	]};
	}
  json_ws_post(wsurl('disease','/_find'),criteria,function(data) {
    var table = "<table>";
	table += "<tr>";
	table += "<th onclick=\"psort(this)\">Index</th>";
	table += "<th>OMIM ID</th>";
	table += "<th>Disease</th>";
	table += "<th>Abbreviation</th>";
	table += "</tr>";
	
	
	for (var i = 0; i < Math.min(data.docs.length,page); i++ ) {
	  table += "<tr valign=\"top\">";
	  table += "<td width=\"50px;\">";
	  table += (i+skip+1);
	  table += "</td>";
	 
	  table += "<td>";
	  table += getdmim_id(data.docs[i]);
	  table += "</td>";
	  
	  table += "<td>";
	  table += getddisease(data.docs[i]);
	  
	  table += "<td>";
	  table += getabb(data.docs[i]);
	  table += "</td>";
	  table += "</td>";
	  
	  table += "</tr>";
	}


	table += "</table>";

	table += "<div style=\"float:right;\"><P>";
	var needsep = false;
	if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptodzero();\">Beginning</A>";
	  table += " - <A href=\"#\" onclick=\"addtodskip(-page);\">Previous</A>";
	  needsep = true;
	}
	if (data.docs.length > page) {
	  if (needsep) {
		table += " - ";
	  }
	  table += "<A href=\"#\" onclick=\"addtodskip(page);\">Next</A>";
   	}
	table += "</P></div>"
    document.getElementById('container').innerHTML = table;
	document.getElementById('search').className = "show";
  });
  return true;
}



//2.4DIESEASE_DETAILED_VIEW_TEST
function disease_detail(mim_id) {
  var criteria = {"selector": {"mim_id": mim_id}, "limit": 1};
  json_ws_post(wsurl('disease','/_find'),criteria,function(data) {
	//console.log(data);
  var table = "<table>";
	table += "<tr><th>OMIM ID</th><td>";
	table += getdmim_id(data.docs[0],false);
	table += "</td></tr>"; 
 
	table += "<tr><th>Disease</th><td>";
	table += getddisease(data.docs[0]);
	table += "</td></tr>"; 
 	

	table += "<tr><th>SNPs</th><td>";
	if(data.docs[0].dbSNP.length>0){
		table += "<table>";
		table += "<tr><th>Index</th><th>SNPs Accession</th><th>Reference Allele</th></tr>";
		for (var i = 0; i < data.docs[0].dbSNP.length; i++ ) {
		table += "<tr>";
		table += "<td>" + (i+1) + "</td>";
		table += "<td onclick=\"snp_detail(this.text);\">" + data.docs[0].dbSNP[i].dbSNP+ "</td>";
		table += "<td>" + data.docs[0].dbSNP[i].reference_allele+ "</td>";
		table += "</tr>";
	}
	table += "</table>";
	}
	else{table += "No information.";}
	
	
 	table += "<tr><th>Proteins</th><td>";
	if(data.docs[0].dbSNP.length>0){
		table += "<table>";
		table += "<tr><th>Index</th><th>Protein Name</th></tr>";
		for (var i = 0; i < data.docs[0].protein.length; i++ ) {
		table += "<tr>";
		table += "<td>" + (i+1) + "</td>";
		table += "<td>" + data.docs[0].protein[i].protein_name+ "</td>";
		table += "<td onclick=\"renderprotein(this.text);\">" + data.docs[0].protein[i].protein_entry+ "</td>";		
		table += "</tr>";
	}
	table += "</table>";
	}
	else{table += "No information.";}
	
	
	table += "</table>";
	table += "</table>";
	table += "<P align=\"right\"><A href=\"#\" onclick=\"renderdisease();\">Return</A></P>"
  document.getElementById('container').innerHTML = table;
	document.getElementById('search').className = "hide";
  });
}
//********************************************************************************************







//********************************************************************************************
//3.SNP
//3.1SNP
function getsaccession(doc,withlink=true){
	var saccession = "";
	if (withlink) {
		saccession += "<A href=\"#\" onclick=\"snp_detail(this.text);\">";
	}
	saccession += doc.dbSNP_accession;
	if (withlink) {
		saccession += "</A></td>";
	}
	return saccession;
}

function getsdisease(doc){
	return doc.disease;
}


function getsprotein(doc){
	return doc.protein;
}

function getsref(doc){
	return doc.reference_allele;
}


function getsmaf(doc){
	return doc.maf;
}




/*
//3.2SNP_SORT
function psort(header){
	var thekey = "_id";
	if (header.innerHTML == "Entry"){
		thekey = "protein_entry"
	}
		if (sort.length == 0 || sort[0][thekey] != "asc") {
		sort = [{[thekey]: "asc"}];
	} else {
		sort = [{[thekey]: "desc"}];
	}
	skiptopzero();
}

function protein_sorttable(header) {
	var thekey = "_id";
	if (header.innerHTML == "Entry") {
	    thekey = "protein_entry";
	} else if (header.innerHTML == "Name") {
	    thekey = "protein_name";
	}
	if (sort.length == 0 || sort[0][thekey] != "asc") {
		sort = [{[thekey]: "asc"}];
	} else {
		sort = [{[thekey]: "desc"}];
	}
	skiptopzero();
}
*/


//3.3SNP_LIST_VIEW
function rendersnp() {
  //var criteria = {"selector": {},sort "limit": 20, "skip": skip};
  var criteria = {"selector":{}, "limit":(page+1), "skip":skip};
  	if (term != ""){
		var caseinsensitiveterm = "(?i)"+term;       //(?i) turns on case-insensitivity mode
	criteria["selector"] = {"$or":[{"dbSNP_accession":{"$regex":caseinsensitiveterm}}]};
	}
  json_ws_post(wsurl('snp','/_find'),criteria,function(data) {
    var table = "<table>";
	table += "<tr>";
	table += "<th onclick=\"ssort(this)\">Index</th>";
	table += "<th>Accession</th>";
	table += "<th>Reference Allele</th>";
	table += "</tr>";
	
	
	for (var i = 0; i < Math.min(data.docs.length,page); i++ ) {
	  table += "<tr valign=\"top\">";
	  table += "<td width=\"50px;\">";
	  table += (i+skip+1);
	  table += "</td>";
	 
	  table += "<td>";
	  table += getsaccession(data.docs[i]);
	  table += "</td>";
	  
	  table += "<td>";
	  table += getsref(data.docs[i]);
	  table += "</td>";
	  
	  table += "</tr>";
	}


	table += "</table>";

	table += "<div style=\"float:right;\"><P>";
	var needsep = false;
	if (skip > 0) {
	  table += "<A href=\"#\" onclick=\"skiptoszero();\">Beginning</A>";
	  table += " - <A href=\"#\" onclick=\"addtosskip(-page);\">Previous</A>";
	  needsep = true;
	}
	if (data.docs.length > page) {
	  if (needsep) {
		table += " - ";
	  }
	  table += "<A href=\"#\" onclick=\"addtosskip(page);\">Next</A>";
   	}
	table += "</P></div>"
    document.getElementById('container').innerHTML = table;
	document.getElementById('search').className = "show";
  });
  return true;
}

//3.4SNP_DETAILED_VIEW
function snp_detail(accession) {
  var criteria = {"selector": {"dbSNP_accession": accession}, "limit": 1};
  json_ws_post(wsurl('snp','/_find'),criteria,function(data) {
	//console.log(data);
  var table = "<table>";
	table += "<tr><th>Accession</th><td>";
	table += getsaccession(data.docs[0],false);
	table += "</td></tr>"; 
 
	table += "<tr><th>Reference Allele</th><td>";
	table += getsref(data.docs[0]);
	table += "</td></tr>"; 
	
	table += "<tr><th>Minor Allele</th><td>";
	if(data.docs[0].maf.length>0){
		table += "<table>";
		table += "<tr><th>Index</th><th>Allele</th><th>Frequence</th><th>Source</th></tr>";
		for (var i = 0; i < data.docs[0].maf.length; i++ ) {
		table += "<tr>";
		table += "<td>" + (i+1) + "</td>";
		table += "<td>" + data.docs[0].maf[i].minor_allele+ "</td>";
		table += "<td>" + data.docs[0].maf[i].maf+ "</td>";
		table += "<td>" + data.docs[0].maf[i].source+ "</td>";
		table += "</tr>";
	}
	table += "</table>";
	}
	else{table += "No information.";}
	
	
	table += "<tr><th>Disease</th><td>";
	if(data.docs[0].disease.length>0){
		table += "<table>";
		table += "<tr><th>Index</th><th>Diseas</th><th>OMIM ID</th></tr>";
		for (var i = 0; i < data.docs[0].protein.length; i++ ) {
		table += "<tr>";
		table += "<td>" + (i+1) + "</td>";
		table += "<td>" + data.docs[0].disease[i].abb+ "</td>";
		table += "<td onclick=\"disease_detail(this.text);\">" + data.docs[0].disease[i].mim_id+ "</td>";
		table += "</tr>";
	}
	table += "</table>";
	}
	else{table += "No information.";}
	
	table += "<tr><th>Protein</th><td>";
	if(data.docs[0].protein.length>0){
		table += "<table>";
		table += "<tr><th>Index</th><th>Proetein</th></tr>";
		for (var i = 0; i < data.docs[0].protein.length; i++ ) {
		table += "<tr>";
		table += "<td>" + (i+1) + "</td>";
		table += "<td onclick=\"renderprotein(this.text);\">" + data.docs[0].protein[i]+"</td>";
		table += "</tr>";
	}
	table += "</table>";
	}
	else{table += "No information.";}
	
	table += "</table>";
	table += "<P align=\"right\"><A href=\"#\" onclick=\"rendersnp();\">Return</A></P>"
  document.getElementById('container').innerHTML = table;
	document.getElementById('search').className = "hide";
  });
}
