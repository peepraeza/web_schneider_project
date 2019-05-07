function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

function diff(a1, a2) {
    return a1.concat(a2).filter(function(val, index, arr){
      return arr.indexOf(val) === arr.lastIndexOf(val);
    });
}

var p1s = [];
var p2s = [];
var p3s = [];
var p4s = [];
var p2_pres = [];
var p3_pres = [];
var p4_pres = [];
for(var i=0;i< data_last7.time[0].length ;i++){
    var times = parseInt(data_last7.time[0][i])*1000; 
    p1s.push([times, parseInt(data_last7.p1[0][i])]);
    p2s.push([times, parseInt(data_last7.p2[0][i])]);
    p3s.push([times, parseInt(data_last7.p3[0][i])]);
    p4s.push([times, parseInt(data_last7.p4[0][i])]);

    p2_pres.push([times, parseInt(data_last7_pre.ap1[i])]);
    p3_pres.push([times, parseInt(data_last7_pre.ap2[i])]);
    p4_pres.push([times, parseInt(data_last7_pre.ap3[i])]);
}


Highcharts.stockChart('main_select', {

    title: {
        text: firstdate+' - '+lastdate
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
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
        enabled: true
    },

    scrollbar: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: ch1_name,
        data: (p1s)
    },{
        name: ch2_name ,
        data: (p2_pres)
    },{
        name: ch3_name ,
        data: (p3_pres)
    },{
        name: ch4_name ,
        data: (p4_pres)
    }]
});

Highcharts.stockChart('ap1_predict_select', {
    title: {
        text: ch2_name
    },
    subtitle: {
        text: firstdate+' - '+lastdate
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
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
        enabled: true
    },

    scrollbar: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: "Actual",
        data: (p2s)
    },{
        name: "Predict" ,
        data: (p2_pres)
    }]
});

Highcharts.stockChart('ap2_predict_select', {
    title: {
        text: ch3_name
    },
    subtitle: {
        text: firstdate+' - '+lastdate
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
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
        enabled: true
    },

    scrollbar: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: "Actual",
        data: (p3s)
    },{
        name: "Predict" ,
        data: (p3_pres)
    }]
});

Highcharts.stockChart('ap3_predict_select', {
    title: {
        text: ch4_name
    },
    subtitle: {
        text: firstdate+' - '+lastdate
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
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
        enabled: true
    },

    scrollbar: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: "Actual",
        data: (p4s)
    },{
        name: "Predict" ,
        data: (p4_pres)
    }]
});

$("#button").click(function() {

    var start_date = $("#datepickerka2").data('daterangepicker').startDate.format('YYYYMMDD');
    var end_date = $("#datepickerka2").data('daterangepicker').endDate.format('YYYYMMDD');
    console.log(end_date);
    var get_all_date = getDates(start_date, end_date);
    console.log(get_all_date)
    $.ajax({
        url: '/ajax/get_date_return_json/',
        data: {all_date : JSON.stringify(get_all_date)},
        dataType: 'json',
        success: function (data) {
            if (Object.keys(data).length > 1) {
                var p1s = [];
                var p2s = [];
                var p3s = [];
                var p4s = [];
                var p2_pres = [];
                var p3_pres = [];
                var p4_pres = [];
                var cols = data.d_col;
                console.log(cols)
                if(get_all_date.length != cols.length){
                    alert("No Data of Date " + diff(get_all_date, cols) +" in Database");
                }
                console.log(cols)
                $("#from_to_date").text("From "+moment(get_all_date[0]).format('DD/MM/YYYY')+" To "+ 
                    moment(get_all_date[get_all_date.length - 1]).format('DD/MM/YYYY'));
                for(var i=0;i< data.time[0].length ;i++){
                    var times = parseInt(data.time[0][i])*1000; 
                    p1s.push([times, parseInt(data.p1[0][i])]);
                    p2s.push([times, parseInt(data.p2[0][i])]);
                    p3s.push([times, parseInt(data.p3[0][i])]);
                    p4s.push([times, parseInt(data.p4[0][i])]);
                    p2_pres.push([times, parseInt(data.pre_ap1[i])]);
                    p3_pres.push([times, parseInt(data.pre_ap2[i])]);
                    p4_pres.push([times, parseInt(data.pre_ap3[i])]);
                }
                
                Highcharts.stockChart('main_select', {
                    title: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
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
                        enabled: true
                    },

                    scrollbar: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: ch1_name,
                        data: (p1s)
                    },{
                        name: ch2_name ,
                        data: (p2_pres)
                    },{
                        name: ch3_name ,
                        data: (p3_pres)
                    },{
                        name: ch4_name ,
                        data: (p4_pres)
                    }]
                });

                Highcharts.stockChart('ap1_predict_select', {
                    title: {
                        text: ch2_name
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
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
                        enabled: true
                    },

                    scrollbar: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Actual",
                        data: (p2s)
                    },{
                        name: "Predict" ,
                        data: (p2_pres)
                    }]
                });

                Highcharts.stockChart('ap2_predict_select', {
                    title: {
                        text: ch3_name
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
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
                        enabled: true
                    },

                    scrollbar: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Actual",
                        data: (p3s)
                    },{
                        name: "Predict" ,
                        data: (p3_pres)
                    }]
                });

                Highcharts.stockChart('ap3_predict_select', {
                    title: {
                        text: ch4_name
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
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
                        enabled: true
                    },

                    scrollbar: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Actual",
                        data: (p4s)
                    },{
                        name: "Predict" ,
                        data: (p4_pres)
                    }]
                });
                
            }else{
                alert("No Data of Date "+ get_all_date + " in Database");
            }
        }
    });
});

$(function() {
    $('#datepickerka2').daterangepicker({
        "autoApply": true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "alwaysShowCalendars": true,
    })
});

$('#datepickerka2').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('#datepickerka2').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});