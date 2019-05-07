var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var i1 = [];
var i2 = [];
var i3 = [];
var i4 = [];
for(var i=0;i<e.length;i++){
    var time = e[i]["time"]*1000;
    p1.push([time, e[i]["P1"]]);
    p2.push([time, e[i]["P2"]]);
    p3.push([time, e[i]["P3"]]);
    p4.push([time, e[i]["P4"]]);
    
    i1.push([time, e[i]["I1"]]);
    i2.push([time, e[i]["I2"]]);
    i3.push([time, e[i]["I3"]]);
    i4.push([time, e[i]["I4"]]);
}
var val_p1 = daily_p[0];
var val_p2 = daily_p[1];
var val_p3 = daily_p[2];
var val_p4 = daily_p[3];
$('#pv1').text(val_p1.toFixed(2));
$('#pv2').text(val_p2.toFixed(2));
$('#pv3').text(val_p3.toFixed(2));
$('#pv4').text(val_p4.toFixed(2));
console.log("start web: "+val_p1);
var val_pp1 = now_p[0];
var val_pp2 = now_p[1];
var val_pp3 = now_p[2];
var val_pp4 = now_p[3];
var bill_cost = bill_cost;
$('#ppm1').text(val_pp1.toFixed(1));
$('#ppm2').text(val_pp2.toFixed(1));
$('#ppm3').text(val_pp3.toFixed(1));
$('#ppm4').text(val_pp4.toFixed(1));
$('#cost_main').text("฿"+parseFloat(bill_cost).toFixed(2));
Highcharts.stockChart('all', {
chart: {
    events: {
        load: function () {

            // set up the updating of the chart each second
            var series1p = this.series[0];
            var series2p = this.series[1];
            var series3p = this.series[2];
            var series4p = this.series[3];

            var series1i = this.series[4];
            var series2i = this.series[5];
            var series3i = this.series[6];
            var series4i = this.series[7];

            var ref = database.ref("energy");
            ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                var changedData = snapshot.val();                        
                var x =  changedData.time*1000;
                var p1 =  changedData.P1;
                var p2 =  changedData.P2;
                var p3 =  changedData.P3;
                var p4 =  changedData.P4;
               
                series1p.addPoint([x, p1], false, true);
                series2p.addPoint([x, p2], false, true);
                series3p.addPoint([x, p3], false, true);
                series4p.addPoint([x, p4], false, true);
                
                var i1 =  changedData.I1;
                var i2 =  changedData.I2;
                var i3 =  changedData.I3;
                var i4 =  changedData.I4;
               
                series1i.addPoint([x, i1], false, true);
                series2i.addPoint([x, i2], false, true);
                series3i.addPoint([x, i3], false, true);
                series4i.addPoint([x, i4], true, true);
                
                $.ajax({
                    url: '/ajax/get_current_energy/',
                    data: {
                      'check': true
                    },
                    dataType: 'json',
                    success: function (data) {
                      if (data) {
                        var val_p1 = data.daily_cur[0]
                        var val_p2 = data.daily_cur[1]
                        var val_p3 = data.daily_cur[2]
                        var val_p4 = data.daily_cur[3]
                        // alert(data.daily_cur[0])
                        var val_pp1 = data.now_p[0]
                        var val_pp2 = data.now_p[1]
                        var val_pp3 = data.now_p[2]
                        var val_pp4 = data.now_p[3]
                        var bill_cost = data.bill_cost;
                        console.log(bill_cost);
                        console.log(val_p1);
                        
                        // alert(val_pp1);
                        $('#pv1').text(val_p1.toFixed(2));
                        $('#pv2').text(val_p2.toFixed(2));
                        $('#pv3').text(val_p3.toFixed(2));
                        $('#pv4').text(val_p4.toFixed(2));
                        
                        $('#ppm1').text(val_pp1.toFixed(1));
                        $('#ppm2').text(val_pp2.toFixed(1));
                        $('#ppm3').text(val_pp3.toFixed(1));
                        $('#ppm4').text(val_pp4.toFixed(1));
                        $('#cost_main').text("฿"+bill_cost.toFixed(2));
                      }
                    }
                });
            })
        }
    }
},
// title:{
//     text: "Real-time Graph"
// },

time: {
    useUTC: false
},

rangeSelector: {
    buttonTheme: {
        visibility: 'hidden'
    },
    labelStyle: {
        visibility: 'hidden'
    },
    inputEnabled: false, // ปิดเลือกวันที่
},
legend: {
    enabled : true,
    verticalAlign: 'top',
    align : "center"
},
yAxis: [{
    labels: {
        align: 'right',
        x: -3,
        format: '{value}W'
    },
    title: {
        text: 'Active Power(P)'
    },
    height: '45%',
    lineWidth: 2
}, {
    labels: {
        align: 'right',
        x: -3,
        format: '{value}A'
    },
    title: {
        text: 'Current(I)'
    },
    top: '55%',
    height: '45%',
    offset: 0,
    lineWidth: 2
}],

credits: {
    enabled: false
},

exporting: {
    enabled: false
},

navigator: {
    enabled: true
},

scrollbar: {
    enabled: false
},
tooltip: {
    valueDecimals: 2,
},

series: [{
    id:"ch1",
    name: ch1_name,
    data: (p1)
},
{
    id:"ch2",
    name: ch2_name,
    data: (p2)
},
{
    id:"ch3",
    name: ch3_name,
    data: (p3)
},{
    id:"ch4",
    name: ch4_name ,
    data: (p4),
},{
    colorIndex:0,
    name: ch1_name,
    linkedTo: "ch1",
    data: (i1),
    yAxis:1,
},{
    colorIndex:1,
    name: ch2_name,
    linkedTo: "ch2",
    data: (i2),
    yAxis:1,
},
{
    colorIndex:2,
    name: ch3_name,
    linkedTo: "ch3",
    data: (i3),
    yAxis:1,
},{
    colorIndex:3,
    name: ch4_name ,
    linkedTo: "ch4",
    data: (i4),
    yAxis:1,
}]
});

Highcharts.stockChart('activePow1', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p1 =  changedData.P1;
                
                    series1.addPoint([x, p1], true, true);
                })
            }
        }
    },
    title:{
        text: "Active Power (P)"
    },
    subtitle:{
        text: ch1_name
    },
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}W'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        name: ch1_name,
        data: (p1)
    }]
});

Highcharts.stockChart('activePow2', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series2 = this.series[1];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p2 =  changedData.P2;
                
                    series2.addPoint([x, p2], true, true);
                })
            }
        }
    },
    subtitle:{
        text: ch2_name
    },
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}W'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        colorIndex:1,
        name: ch2_name,
        data: (p2)
    }]
});

Highcharts.stockChart('activePow3', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series3 = this.series[2];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p3 =  changedData.P3;
                
                    series3.addPoint([x, p3], true, true);
                })
            }
        }
    },

    subtitle:{
        text: ch3_name
    },
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}W'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        colorIndex:2,
        name: ch3_name,
        data: (p3)
    }]
});

Highcharts.stockChart('activePow4', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series4 = this.series[3];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p4 =  changedData.P4;
                
                    series4.addPoint([x, p4], true, true);
                })
            }
        }
    },
    subtitle:{
        text: ch4_name
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}W'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        colorIndex:3,
        name: ch4_name ,
        data: (p4)
    }]
});

Highcharts.stockChart('current1', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var i1 =  changedData.I1;
                
                    series1.addPoint([x, i1], true, true);
                })
            }
        }
    },
    title:{
        text: "Current (I)"
    },
    subtitle:{
        text: ch1_name
    },
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}A'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        name: ch1_name,
        data: (i1)
    }]
});

Highcharts.stockChart('current2', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series2 = this.series[1];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var i2 =  changedData.I2;
                
                    series2.addPoint([x, i2], true, true);
                })
            }
        }
    },
    subtitle:{
        text: ch2_name
    },
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}VA'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        colorIndex:1,
        name: ch2_name,
        data: (i2)
    }]
});

Highcharts.stockChart('current3', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series3 = this.series[2];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var i3 =  changedData.I3;
                
                    series3.addPoint([x, i3], true, true);
                })
            }
        }
    },
    subtitle:{
        text: ch3_name
    },
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}VA'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        colorIndex:2,
        name: ch3_name,
        data: (i3)
    }]
});

Highcharts.stockChart('current4', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series4 = this.series[3];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var i4 =  changedData.I4;
                
                    series4.addPoint([x, i4], true, true);
                })
            }
        }
    },
    subtitle:{
        text: ch4_name
    },
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : false,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        labels: {
            format: '{value}A'
        },
    },
    tooltip: {
        valueDecimals: 2,
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    navigator: {
        enabled: false
    },

    scrollbar: {
        enabled: false
    },

    series: [{
        colorIndex:3,
        name: ch4_name,
        data: (i4)
    }]
});