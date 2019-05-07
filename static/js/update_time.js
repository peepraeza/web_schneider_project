function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function unixtime_to_readable(unixtime){
  var d = new Date(unixtime*1000);
  return d.getDate()+"/"+addZero((d.getMonth()+1))+"/"+(d.getFullYear()+543)+" "+addZero(d.getHours())+":"+addZero(d.getMinutes())+":"+addZero(d.getSeconds());
  
}

var refX = database.ref("X");
refX.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
	var changedData = snapshot.val();
	var time = changedData.time;
  document.getElementById("updated_time_x").innerHTML = "อัพเดตเวลาล่าสุด : "+(unixtime_to_readable(time));
});

var refA = database.ref("A");
refA.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
	var changedData = snapshot.val();
	var time = changedData.time;
  document.getElementById("updated_time_a").innerHTML = "อัพเดตเวลาล่าสุด : "+(unixtime_to_readable(time));
});

var refB = database.ref("B");
refB.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
	var changedData = snapshot.val();
	var time = changedData.time;
  document.getElementById("updated_time_b").innerHTML = "อัพเดตเวลาล่าสุด : "+(unixtime_to_readable(time));
});

var refC = database.ref("C");
refC.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
	var changedData = snapshot.val();
	var time = changedData.time;
  document.getElementById("updated_time_c").innerHTML = "อัพเดตเวลาล่าสุด : "+(unixtime_to_readable(time));
});