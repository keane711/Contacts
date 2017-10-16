// массив с контактами

var arr = [];
var selectedID;

var db;
var version = 1.0;
var dbName = 'tizendb';
var dbDisplayName = 'tizen_test_db';
var dbSize = 2 * 1024 * 1024;

function selectDB() {
    if (window.openDatabase) {
     
        db = openDatabase(dbName, version, dbDisplayName, dbSize);
        
       // dropTable(db);
        createTable(db);
        
        //insertData(db, "Дмитрий Бикмаев", "89232342340");
       // insertData(db, "Владислав Липатов", "8923277041");
        //insertData(db, "Рамзан  Кадыров", "8900007777");
        
        dataView(db);
    } else {
    	alert("Web SQL Database not supported in this browser");
      }
}
function createTable(db) {
    db.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS tizenTable (name TEXT, phone TEXT)", []);
    });
}
function insertData(db, name, phone) {
    db.transaction(function (e) {
  
        e.executeSql("INSERT INTO tizenTable(name, phone) VALUES (?, ?)", [name, phone]);
    });
}
function deleteData(db, name) {
    db.transaction(function (e) {
  
        e.executeSql("DELETE FROM tizenTable WHERE name=(?)", [name]);
    });
}
function updateData(db, name, phone, oldname) {
    db.transaction(function (e) {
  
        e.executeSql("UPDATE tizenTable SET name=?, phone=? WHERE name =? ", [name,phone,oldname], onSuccess, onError);
    });
}
function onSuccess(e) { }
function onError(e) {alert("NOTinsertORdeleteORupdate"); }

function dataView(db) {
	db.transaction(function (t) {
        t.executeSql("SELECT * FROM tizenTable", [],
        function (tran, r) {
        	for (var i = 0; i < r.rows.length; i++) {
        		var person = {};
        		person.id = r.rows.item(i).id; 
        		person.name = r.rows.item(i).name;
        		person.phone = r.rows.item(i).phone;
        		console.log(person.id);
        		$('ul').append('<li id = ' + i +  ' class="ui-li-static"   > '+person.name +'</li>');
        		arr.push(person);
        	}  
        },
        function (t, e) { alert("Error:" + e.message); });
	});	
}


function dropTable(db) {
    db.transaction(function (e) {
        e.executeSql("DROP TABLE tizenTable");
    });
}
// добавление контакта
$('body').on('click',"#addButton" ,function() {

	var newName = $("#inputName").val();
	var newNumber = $("#inputNumber").val();
	if (!(newName === "") && !(newNumber === "") ){
	
		var person = {};
		person.name = newName;
		person.phone = newNumber;
		arr.push(person);
		insertData(db,newName, newNumber);
		$('ul').append('<li id = ' + (arr.length-1) +  ' class="ui-li-static"   > '+newName +'</li>');
		$('#popupAdd').fadeOut("slow");
	}
	 
});

//клик по контакту

$('body').on('click', '.ui-li-static', function() {
	var currentProfile = this;
	$('#popupHead').text(arr[currentProfile.id].name);
	$('#popupCont').text('Номер:  '+arr[currentProfile.id].phone);
	$('#popup').fadeIn("slow");
	$('#popupAdd').hide();
	selectedID = this.id;
});

// удалить контакт
$("body").on('click','#deleteCont', function() {
	deleteData(db, arr[selectedID].name);
	delete arr[selectedID];
	$("#"+selectedID).remove();
	for (var i = selectedID+1;  i<(arr.length-1); i++)
	{
		$("#"+i).id = i-1; 
	}
	$('#popup').fadeOut("slow");
});
// изменить контакт
$("body").on('click','#changeCont', function() {
	
	$('#popup').fadeOut("slow");
	$('#popupChange').fadeIn("slow");
	$('#changeName').attr("value",arr[selectedID].name);
	$('#changeNumber').attr("value",arr[selectedID].phone);	
});
// применить изменения
$("body").on('click','#changeButton', function() {
	var changedName = $('#changeName').val();
	var changedPhone =  $('#changeNumber').val();
	var oldname = arr[selectedID].name; 
	updateData(db, changedName, changedPhone, oldname);
	arr[selectedID].name = changedName;
	arr[selectedID].phone = changedPhone;
	$("#"+selectedID).text(changedName); 
	$('#popupChange').fadeOut("slow");

});

// закрытие окон
$('body').on('click', '.ui-header', function() {
	$('#popupAdd').fadeOut("slow");
	$('#popupChange').fadeOut("slow");
	$('#popup').fadeOut("slow");
});
//открытие окна добавления контактов
$('body').on('click',"#add" ,function() {
	$('#inputName').val("");
	$('#inputNumber').val(''); 
	$('#popupAdd').fadeIn("slow");
	 
	 
});

window.onload = function () {
selectDB();
};













	