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

var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var i1 = [];
var i2 = [];
var i3 = [];
var i4 = [];
for(var i=0;i< data_last7.time[0].length ;i++){
    var time = parseInt(data_last7.time[0][i])*1000; 
    p1.push([time, parseInt(data_last7.p1[0][i])]);
    p2.push([time, parseInt(data_last7.p2[0][i])]);
    p3.push([time, parseInt(data_last7.p3[0][i])]);
    p4.push([time, parseInt(data_last7.p4[0][i])]);

    i1.push([time, parseInt(data_last7.i1[0][i])]);
    i2.push([time, parseInt(data_last7.i2[0][i])]);
    i3.push([time, parseInt(data_last7.i3[0][i])]);
    i4.push([time, parseInt(data_last7.i4[0][i])]);
}
console.log(lastdate)
var chart_year = Highcharts.chart('container_kwh', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Whole Energy Per Day'
    },
    subtitle: {
        text: firstdate+' - '+lastdate
    },
    xAxis: {
        categories: col,
        max:6,
        crosshair: true,
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Energy (kwh)'
        }
    },
    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f} kwh</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
        series: {
            dataLabels: {
                enabled: true,
                align: 'center',
                format: '{y:.2f}',
                style: {
                    fontSize: '9px',
                }
            },
            cursor: 'pointer',
            point: {
                events: {
                    click: function () {
                        alert('Category: ' + this.category);
                    }
                }
            },
        }
    },
    series: [{
        id: 'ch1',
        name: ch1_name,
        data: p1_wh
    },{
        id: 'ch2',
        name: ch2_name,
        data: p2_wh
    },{
        id: 'ch3',
        name: ch3_name,
        data: p3_wh
    },{
        id: 'ch4',
        name: ch4_name,
        data: p4_wh
    }]
});

Highcharts.stockChart('all', {
    title: {
        text: 'All'
    },
    subtitle: {
        text: firstdate+' - '+lastdate
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

Highcharts.stockChart('container_p', {
    title: {
        text: 'Active Power'
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
        name: ch1_name,
        data: (p1)
    },
    {
        name: ch2_name,
        data: (p2)
    },
    {
        name: ch3_name,
        data: (p3)
    },{
        name: ch4_name ,
        data: (p4)
    }]
});

Highcharts.stockChart('container_i', {
    title: {
        text: 'Current'
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
            text: "Current(I)"
        },
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
        data: (i1)
    },
    {
        name: ch2_name,
        data: (i2)
    },
    {
        name: ch3_name,
        data: (i3)
    },{
        name: ch4_name ,
        data: (i4)
    }]
});

$(function() {
  $('#datepickerka').daterangepicker({
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
$("#button").click(function() {
    var start_date = $("#datepickerka").data('daterangepicker').startDate.format('YYYYMMDD');
    var end_date = $("#datepickerka").data('daterangepicker').endDate.format('YYYYMMDD');
    console.log(end_date);
    var get_all_date = getDates(start_date, end_date);
    console.log(get_all_date)
    $.ajax({
        url: '/ajax/get_date_return_json/',
        data: {all_date : JSON.stringify(get_all_date)},
        dataType: 'json',
        success: function (data) {
            if (Object.keys(data).length > 1) {
                var p1 = [];
                var p2 = [];
                var p3 = [];
                var p4 = [];
                var i1 = [];
                var i2 = [];
                var i3 = [];
                var i4 = [];
                var p1_whs = data.p1_val;
                var p2_whs = data.p2_val;
                var p3_whs = data.p3_val;
                var p4_whs = data.p4_val;
                var cols = data.d_col;
                console.log(cols)
                if(get_all_date.length != cols.length){
                    alert("No Data of Date " + diff(get_all_date, cols) +" in Database");
                }
                console.log(cols)
                $("#from_to_date").text("From "+moment(get_all_date[0]).format('DD/MM/YYYY')+" To "+ 
                    moment(get_all_date[get_all_date.length - 1]).format('DD/MM/YYYY'));
                $("#sum_p1_val").text(data.sum_p1_val);
                $("#sum_p2_val").text(data.sum_p2_val);
                $("#sum_p3_val").text(data.sum_p3_val);
                $("#sum_p4_val").text(data.sum_p4_val);
                $("#cost_by_date").text("฿"+data.cost_by_date);
                for(var i=0;i< data.time[0].length ;i++){
                    var time = parseInt(data.time[0][i])*1000; 
                    p1.push([time, parseInt(data.p1[0][i])]);
                    p2.push([time, parseInt(data.p2[0][i])]);
                    p3.push([time, parseInt(data.p3[0][i])]);
                    p4.push([time, parseInt(data.p4[0][i])]);
                    i1.push([time, parseInt(data.i1[0][i])]);
                    i2.push([time, parseInt(data.i2[0][i])]);
                    i3.push([time, parseInt(data.i3[0][i])]);
                    i4.push([time, parseInt(data.i4[0][i])]);
                }
                if(get_all_date.length <= 7){
                    var max_series = get_all_date.length-1;
                }else{
                    var max_series = 6;
                }
                Highcharts.chart('container_kwh', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Whole Energy Per Day'
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: cols,
                        min:0,
                        max:max_series,
                        scrollbar: {
                            enabled: true
                        },
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Energy (kwh)'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.2f} kwh</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        },
                        series: {
                            dataLabels: {
                                enabled: true,
                                align: 'center',
                                format: '{y:.2f}',
                                style: {
                                    fontSize: '9px',
                                }
                            },
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        alert('Category: ' + this.category);
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        name: ch1_name,
                        data: p1_whs
                    },{
                        name: ch2_name,
                        data: p2_whs
                    },{
                        name: ch3_name,
                        data: p3_whs
                    },{
                        name: ch4_name,
                        data: p4_whs
                    }]
                });

                Highcharts.stockChart('all', {
                    title: {
                        text: 'All'
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
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

                Highcharts.stockChart('container_p', {
                    title: {
                        text: 'Active Power'
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

                    series: [{
                        name: ch1_name,
                        data: (p1)
                    },
                    {
                        name: ch2_name,
                        data: (p2)
                    },
                    {
                        name: ch3_name,
                        data: (p3)
                    },{
                        name: ch4_name ,
                        data: (p4)
                    }]
                });
                
                Highcharts.stockChart('container_i', {
                    title: {
                        text: 'Current'
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
                        text: "Current(I)"
                    },
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
                        enabled: true
                    },

                    scrollbar: {
                        enabled: false
                    },

                    series: [{
                        name: ch1_name,
                        data: (i1)
                    },
                    {
                        name: ch2_name,
                        data: (i2)
                    },
                    {
                        name: ch3_name,
                        data: (i3)
                    },{
                        name: ch4_name ,
                        data: (i4)
                    }]
                });
                
            }else{
                alert("No Data of Date "+ get_all_date + " in Database");
            }
        }
    });
});


$('#datepickerka').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    
});

$('#datepickerka').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});
});