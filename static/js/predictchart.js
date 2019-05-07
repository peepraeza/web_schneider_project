var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var p2_pre = [];
var p3_pre = [];
var p4_pre = [];
for(var i=0;i<e.length;i++){
    var time = e[i]["time"]*1000;
    p2_pre.push([time, pred["ap1"][i]]);
    p3_pre.push([time, pred["ap2"][i]]);
    p4_pre.push([time, pred["ap3"][i]]);

    p1.push([time, e[i]["P1"]]);
    p2.push([time, e[i]["P2"]]);
    p3.push([time, e[i]["P3"]]);
    p4.push([time, e[i]["P4"]]);
}
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

Highcharts.stockChart('actual_main', {
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

                    $('#ppm1').text(p1.toFixed(1));
                })
            }
        }
    },
    title: {
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
        align : "right"
    },
    yAxis: {
      title: {
          text: "Active Power(P)"
      },
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
        name: 'Actual',
        data: (p1)
    }]
    });

Highcharts.stockChart('predict_ap1', {
chart: {
    events: {
        load: function () {
            // set up the updating of the chart each second
            var series1 = this.series[0];
            var series2 = this.series[1];
            var ref = database.ref("energy");
            ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                var changedData = snapshot.val();                        
                var x =  changedData.time*1000;
                var p2 =  changedData.P2;
                series1.addPoint([x, p2], false, true);

                $.ajax({
                    url: '/ajax/get_current_predict/',
                    data: {
                      'check': true
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            var p2_pre = data['ap1'][0]
                            // alert(data);
                            series2.addPoint([x, p2_pre], true, true);
                            $('#ppm2').text(p2_pre.toFixed(1));
                        }
                    }
                });
            })
        }
    }
},
title: {
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
    enabled : true,
    verticalAlign: 'top',
    align : "center"
},
yAxis: {
  title: {
      text: "Active Power(P)"
  },
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
    name: 'Actual',
    data: (p2)
},
{
    name: 'Predict',
    data: (p2_pre)
},]
});

Highcharts.stockChart('predict_ap3', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                var series2 = this.series[1];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p4 =  changedData.P4;
                    series1.addPoint([x, p4], false, true);
                    $.ajax({
                        url: '/ajax/get_current_predict/',
                        data: {
                          'check': true
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data) {
                                var p4_pre = data['ap3'][0]
                                // alert(data);
                                series2.addPoint([x, p4_pre], true, true);
                                $('#ppm4').text(p4_pre.toFixed(1));
                            }
                        }
                    });
                })
            }
        }
    },
    title: {
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
        },        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : true,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
      title: {
          text: "Active Power(P)"
      },
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
        name: 'Actual',
        data: (p4)
    },
    {
        name: 'Predict',
        data: (p4_pre)
    },]
    });

Highcharts.stockChart('predict_ap2', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                var series2 = this.series[1];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p3 =  changedData.P3;
                    series1.addPoint([x, p3], false, true);
                    $.ajax({
                        url: '/ajax/get_current_predict/',
                        data: {
                          'check': true
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data) {
                                var p3_pre = data['ap2'][0]
                                // alert(data);
                                series2.addPoint([x, p3_pre], true, true);
                                $('#ppm3').text(p3_pre.toFixed(1));
                            }
                        }
                    });
                })
            }
        }
    },
    title: {
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
        enabled : true,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
      title: {
          text: "Active Power(P)"
      },
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
        name: 'Actual',
        data: (p3)
    },
    {
        name: 'Predict',
        data: (p3_pre)
    },]
});