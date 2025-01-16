/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.33333333333333, "KoPercent": 4.666666666666667};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.17888888888888888, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13, 500, 1500, "Get List of Containers"], "isController": false}, {"data": [0.03, 500, 1500, "Get List of Department"], "isController": false}, {"data": [0.03, 500, 1500, "Get List of Alert Profiles"], "isController": false}, {"data": [0.01, 500, 1500, "Get the List of Alerts"], "isController": false}, {"data": [0.32, 500, 1500, "Get List of Regions"], "isController": false}, {"data": [0.36, 500, 1500, "Search Rule"], "isController": false}, {"data": [0.05, 500, 1500, "Get List of Cities"], "isController": false}, {"data": [0.1, 500, 1500, "Get the List of Alerts For Map"], "isController": false}, {"data": [0.02, 500, 1500, "Login"], "isController": false}, {"data": [0.13, 500, 1500, "Search Users"], "isController": false}, {"data": [0.0, 500, 1500, "Search Zones for List For Map"], "isController": false}, {"data": [0.0, 500, 1500, "Search Devices for List For Map"], "isController": false}, {"data": [0.14, 500, 1500, "Get List of Devices"], "isController": false}, {"data": [1.0, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.29, 500, 1500, "Get List of Zones"], "isController": false}, {"data": [0.45, 500, 1500, "Get the List of Default config for the Departments"], "isController": false}, {"data": [0.0, 500, 1500, "Search Containers for List For Map"], "isController": false}, {"data": [0.16, 500, 1500, "Get list of Tasks"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 900, 42, 4.666666666666667, 17415.213333333344, 0, 72643, 4158.0, 53289.7, 60155.95, 60412.5, 2.350464739111472, 18.829028255850698, 2.432042392263837], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get List of Containers", 50, 2, 4.0, 17967.079999999998, 436, 65817, 12441.0, 48571.6, 60297.35, 65817.0, 0.13115717351044798, 0.34950056577925726, 0.1699638145555608], "isController": false}, {"data": ["Get List of Department", 50, 12, 24.0, 21442.919999999995, 697, 60887, 4452.5, 60217.4, 60359.15, 60887.0, 0.14570420298343925, 1.8213139204338489, 0.1577390286556456], "isController": false}, {"data": ["Get List of Alert Profiles", 50, 0, 0.0, 6240.959999999999, 525, 29480, 3475.5, 19487.999999999996, 24833.499999999993, 29480.0, 0.13146927431589964, 0.3759148207284975, 0.15213716863169408], "isController": false}, {"data": ["Get the List of Alerts", 50, 0, 0.0, 19486.91999999999, 814, 60077, 8435.0, 50834.5, 54412.24999999998, 60077.0, 0.13130527952267906, 0.8627577522637031, 0.16989928638863214], "isController": false}, {"data": ["Get List of Regions", 50, 3, 6.0, 10781.619999999997, 339, 72643, 1174.5, 43629.99999999999, 60299.15, 72643.0, 0.13182490488833112, 0.5198046527929743, 0.1421983920327664], "isController": false}, {"data": ["Search Rule", 50, 0, 0.0, 4243.459999999998, 288, 21910, 846.0, 18203.799999999996, 19650.249999999993, 21910.0, 0.13420296856966477, 2.3716836139852915, 0.1433219554379043], "isController": false}, {"data": ["Get List of Cities", 50, 6, 12.0, 14205.099999999997, 455, 63545, 2874.5, 60163.7, 60273.0, 63545.0, 0.13150523522341426, 0.755543808667773, 0.141596720949836], "isController": false}, {"data": ["Get the List of Alerts For Map", 50, 10, 20.0, 22831.92, 557, 60423, 12879.5, 60168.8, 60380.6, 60423.0, 0.13300843805531024, 0.055073806382276894, 0.17612966975999958], "isController": false}, {"data": ["Login", 50, 0, 0.0, 3384.4799999999996, 860, 18252, 2607.5, 4930.099999999999, 5716.049999999995, 18252.0, 2.638104785522081, 4.1065810821505835, 1.0794588917321797], "isController": false}, {"data": ["Search Users", 50, 1, 2.0, 14045.139999999996, 777, 60158, 1918.5, 47005.2, 56085.1, 60158.0, 0.13501653952609194, 2.4075057592992644, 0.1436633995476946], "isController": false}, {"data": ["Search Zones for List For Map", 50, 1, 2.0, 47286.380000000005, 20668, 60167, 48263.0, 59351.7, 59803.65, 60167.0, 0.13460363268283887, 0.5616073675971367, 0.14453853752480073], "isController": false}, {"data": ["Search Devices for List For Map", 50, 1, 2.0, 45941.02, 9834, 68371, 46795.5, 54802.4, 59027.19999999999, 68371.0, 0.13196686048199577, 0.5449999364909485, 0.14170714887577432], "isController": false}, {"data": ["Get List of Devices", 50, 2, 4.0, 18036.060000000005, 306, 60270, 9068.5, 49853.1, 58447.349999999984, 60270.0, 0.13444221270371357, 0.47973025262363983, 0.16647464537505344], "isController": false}, {"data": ["randomPageSize", 50, 0, 0.0, 0.49999999999999994, 0, 9, 0.0, 1.0, 1.0, 9.0, 2.772387025228722, 0.0, 0.0], "isController": false}, {"data": ["Get List of Zones", 50, 0, 0.0, 4461.340000000001, 294, 18071, 1486.5, 12173.6, 15993.949999999999, 18071.0, 0.14180776539323292, 7.349890940965428, 0.15875822485039282], "isController": false}, {"data": ["Get the List of Default config for the Departments", 50, 0, 0.0, 3189.74, 252, 18071, 775.5, 11428.5, 14029.9, 18071.0, 0.13612146390467142, 0.23034303970118616, 0.1459849527930763], "isController": false}, {"data": ["Search Containers for List For Map", 50, 4, 8.0, 51564.82, 9220, 62712, 54617.0, 60135.8, 60189.05, 62712.0, 0.1314043179458877, 0.2540286716008988, 0.14135973492463963], "isController": false}, {"data": ["Get list of Tasks", 50, 0, 0.0, 8364.380000000001, 492, 45835, 1771.5, 30289.399999999998, 42252.79999999999, 45835.0, 0.13189201736754086, 0.6740377611791674, 0.1478092200103931], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 42, 100.0, 4.666666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 900, 42, "504/Gateway Time-out", 42, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get List of Containers", 50, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get List of Department", 50, 12, "504/Gateway Time-out", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get List of Regions", 50, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get List of Cities", 50, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get the List of Alerts For Map", 50, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Users", 50, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search Zones for List For Map", 50, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search Devices for List For Map", 50, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get List of Devices", 50, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Containers for List For Map", 50, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
