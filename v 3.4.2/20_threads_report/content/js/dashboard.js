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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37083333333333335, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "Get List of Containers"], "isController": false}, {"data": [0.1, 500, 1500, "Get List of Department"], "isController": false}, {"data": [0.175, 500, 1500, "Get List of Alert Profiles"], "isController": false}, {"data": [0.125, 500, 1500, "Get the List of Alerts"], "isController": false}, {"data": [0.6, 500, 1500, "Get List of Regions"], "isController": false}, {"data": [0.6, 500, 1500, "Search Rule"], "isController": false}, {"data": [0.4, 500, 1500, "Get List of Cities"], "isController": false}, {"data": [0.2, 500, 1500, "Get the List of Alerts For Map"], "isController": false}, {"data": [0.125, 500, 1500, "Login"], "isController": false}, {"data": [0.5, 500, 1500, "Search Users"], "isController": false}, {"data": [0.0, 500, 1500, "Search Zones for List For Map"], "isController": false}, {"data": [0.0, 500, 1500, "Search Devices for List For Map"], "isController": false}, {"data": [0.3, 500, 1500, "Get List of Devices"], "isController": false}, {"data": [1.0, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.95, 500, 1500, "Get the List of Default config for the Departments"], "isController": false}, {"data": [0.625, 500, 1500, "Get List of Zones"], "isController": false}, {"data": [0.0, 500, 1500, "Search Containers for List For Map"], "isController": false}, {"data": [0.6, 500, 1500, "Get list of Tasks"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 360, 0, 0.0, 7169.844444444441, 0, 46185, 1265.5, 30100.400000000012, 32748.85, 37550.81, 2.2640797459199393, 18.162023452485773, 2.3424356741926355], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get List of Containers", 20, 0, 0.0, 6943.350000000001, 368, 23852, 1886.5, 23205.900000000005, 23830.05, 23852.0, 0.1285776737727261, 0.32415009153123153, 0.16660477191927894], "isController": false}, {"data": ["Get List of Department", 20, 0, 0.0, 1939.8000000000002, 1128, 3754, 1840.0, 2514.8, 3692.249999999999, 3754.0, 0.14655020810129551, 2.1617944637911073, 0.1586363068065244], "isController": false}, {"data": ["Get List of Alert Profiles", 20, 0, 0.0, 1690.3, 577, 2560, 1749.5, 2429.8, 2554.0499999999997, 2560.0, 0.13103497978785436, 0.4065411433457161, 0.15161796465003832], "isController": false}, {"data": ["Get the List of Alerts", 20, 0, 0.0, 9062.600000000002, 965, 32472, 3371.0, 30885.500000000004, 32400.649999999998, 32472.0, 0.1282758443757456, 0.7503573183774389, 0.16596313713008454], "isController": false}, {"data": ["Get List of Regions", 20, 0, 0.0, 698.75, 205, 1129, 709.0, 951.1, 1120.25, 1129.0, 0.13161098425274573, 0.5995818575080777, 0.14195092925580569], "isController": false}, {"data": ["Search Rule", 20, 0, 0.0, 594.4, 321, 1070, 588.5, 806.7, 1056.85, 1070.0, 0.12787478501051772, 1.966855305285065, 0.1365475426462408], "isController": false}, {"data": ["Get List of Cities", 20, 0, 0.0, 1290.6999999999998, 360, 2249, 1383.5, 1989.1000000000004, 2236.8999999999996, 2249.0, 0.12731717254023223, 0.9060345057388216, 0.13707111022165921], "isController": false}, {"data": ["Get the List of Alerts For Map", 20, 0, 0.0, 12328.35, 516, 46185, 4248.0, 44378.900000000016, 46133.45, 46185.0, 0.13021596317492562, 0.05811396012787207, 0.1724153453815653], "isController": false}, {"data": ["Login", 20, 0, 0.0, 2979.75, 1166, 4990, 2929.0, 4875.1, 4985.0, 4990.0, 4.00320256204964, 6.231547738190552, 1.6380291733386707], "isController": false}, {"data": ["Search Users", 20, 0, 0.0, 1000.55, 291, 1588, 1052.0, 1329.9, 1575.35, 1588.0, 0.13020324726898688, 2.2074091445809407, 0.1385253200558572], "isController": false}, {"data": ["Search Zones for List For Map", 20, 0, 0.0, 24628.9, 11624, 30564, 29006.0, 30516.8, 30563.05, 30564.0, 0.1287249790821909, 0.5057546602465083, 0.13820964673038552], "isController": false}, {"data": ["Search Devices for List For Map", 20, 0, 0.0, 25931.85, 10342, 36111, 29717.0, 35906.700000000004, 36109.3, 36111.0, 0.13114410113833078, 0.513114102744846, 0.14080701366849396], "isController": false}, {"data": ["Get List of Devices", 20, 0, 0.0, 7552.45, 359, 24089, 2408.5, 21090.100000000002, 23943.149999999998, 24089.0, 0.14697452931406987, 0.5716361893546348, 0.1819742744051206], "isController": false}, {"data": ["randomPageSize", 20, 0, 0.0, 1.55, 0, 12, 1.0, 9.10000000000002, 11.899999999999999, 12.0, 5.894488653109343, 0.0, 0.0], "isController": false}, {"data": ["Get the List of Default config for the Departments", 20, 0, 0.0, 380.04999999999995, 190, 539, 388.5, 517.1000000000001, 538.3, 539.0, 0.1277473668074017, 0.21617249726940005, 0.1370040607694224], "isController": false}, {"data": ["Get List of Zones", 20, 0, 0.0, 713.9499999999999, 285, 1450, 574.5, 1275.6, 1441.3, 1450.0, 0.13080188093104778, 6.78063410708096, 0.1464367932610871], "isController": false}, {"data": ["Search Containers for List For Map", 20, 0, 0.0, 30376.55, 11746, 37782, 33207.5, 36057.700000000004, 37704.15, 37782.0, 0.13475363666376947, 0.3337784414394383, 0.14494569638995006], "isController": false}, {"data": ["Get list of Tasks", 20, 0, 0.0, 943.3499999999999, 409, 1384, 1024.0, 1257.8, 1377.75, 1384.0, 0.1315010848839503, 0.5811795750049312, 0.1473544139161023], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 360, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
