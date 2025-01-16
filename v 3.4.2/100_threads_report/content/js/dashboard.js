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

    var data = {"OkPercent": 60.44444444444444, "KoPercent": 39.55555555555556};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07027777777777777, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.005, 500, 1500, "Get List of Containers"], "isController": false}, {"data": [0.0, 500, 1500, "Get List of Alert Profiles"], "isController": false}, {"data": [0.0, 500, 1500, "Get List of Department"], "isController": false}, {"data": [0.0, 500, 1500, "Get the List of Alerts"], "isController": false}, {"data": [0.015, 500, 1500, "Get List of Regions"], "isController": false}, {"data": [0.01, 500, 1500, "Get the List of Alerts For Map"], "isController": false}, {"data": [0.07, 500, 1500, "Search Rule"], "isController": false}, {"data": [0.015, 500, 1500, "Get List of Cities"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Search Users"], "isController": false}, {"data": [0.0, 500, 1500, "Search Devices for List For Map"], "isController": false}, {"data": [0.0, 500, 1500, "Search Zones for List For Map"], "isController": false}, {"data": [0.02, 500, 1500, "Get List of Devices"], "isController": false}, {"data": [1.0, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.075, 500, 1500, "Get the List of Default config for the Departments"], "isController": false}, {"data": [0.025, 500, 1500, "Get List of Zones"], "isController": false}, {"data": [0.0, 500, 1500, "Search Containers for List For Map"], "isController": false}, {"data": [0.03, 500, 1500, "Get list of Tasks"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 712, 39.55555555555556, 37073.401111111096, 0, 60862, 41586.5, 60344.0, 60360.0, 60420.99, 2.3648613140220514, 12.152052586714866, 2.44666919548075], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get List of Containers", 100, 42, 42.0, 39952.589999999975, 683, 60427, 42446.0, 60356.0, 60367.9, 60426.94, 0.13571448928601965, 0.12840658211880174, 0.17584966388610296], "isController": false}, {"data": ["Get List of Alert Profiles", 100, 16, 16.0, 29362.929999999993, 1705, 60374, 27899.0, 60167.8, 60335.95, 60373.94, 0.13477470386628193, 0.17468328365762373, 0.15594249256043632], "isController": false}, {"data": ["Get List of Department", 100, 89, 89.0, 56212.33999999999, 1843, 60420, 60245.0, 60359.8, 60371.95, 60419.8, 0.1363650000136365, 0.21801088039289482, 0.1476084540674952], "isController": false}, {"data": ["Get the List of Alerts", 100, 26, 26.0, 34883.29999999999, 3516, 60368, 34834.5, 60314.9, 60343.8, 60367.95, 0.1327332022814183, 0.4597494445115485, 0.1717274691196205], "isController": false}, {"data": ["Get List of Regions", 100, 69, 69.0, 49762.530000000006, 302, 60645, 60167.5, 60362.8, 60425.3, 60643.31, 0.13667120870650268, 0.14261186837400897, 0.14740603811691674], "isController": false}, {"data": ["Get the List of Alerts For Map", 100, 34, 34.0, 36299.420000000006, 851, 60599, 35689.5, 60335.9, 60354.75, 60596.729999999996, 0.13325107300426536, 0.052168315593173815, 0.1764314475697003], "isController": false}, {"data": ["Search Rule", 100, 5, 5.0, 27307.8, 383, 60355, 26592.0, 54609.200000000004, 60039.59999999998, 60354.77, 0.13374473212936325, 2.0062336747836347, 0.142812990675986], "isController": false}, {"data": ["Get List of Cities", 100, 68, 68.0, 49336.759999999995, 1212, 60612, 60165.0, 60358.9, 60380.85, 60610.11, 0.1367220345332515, 0.19846057825217286, 0.147193820830559], "isController": false}, {"data": ["Login", 100, 0, 0.0, 8518.730000000001, 4987, 12011, 8447.0, 10703.3, 11124.05, 12007.369999999999, 7.816774798718049, 12.167909208160713, 3.198465469397327], "isController": false}, {"data": ["Search Users", 100, 76, 76.0, 51964.99000000001, 1641, 60525, 60168.0, 60366.8, 60385.55, 60524.63, 0.13786752034235264, 0.5763858658562814, 0.14667677020172776], "isController": false}, {"data": ["Search Devices for List For Map", 100, 66, 66.0, 57190.229999999996, 8536, 60617, 60161.5, 60354.9, 60367.95, 60614.64, 0.1329978241555968, 0.1946807603352609, 0.1427947244251834], "isController": false}, {"data": ["Search Zones for List For Map", 100, 74, 74.0, 57325.80999999999, 18455, 60441, 60168.0, 60357.0, 60369.75, 60440.43, 0.1332118441314854, 0.16509032304205232, 0.14302450956394436], "isController": false}, {"data": ["Get List of Devices", 100, 37, 37.0, 36870.819999999985, 229, 60383, 40753.0, 60348.3, 60357.9, 60382.82, 0.14109646059528597, 0.23694835693171637, 0.17469367737941544], "isController": false}, {"data": ["randomPageSize", 100, 0, 0.0, 0.3199999999999999, 0, 11, 0.0, 1.0, 1.0, 10.899999999999949, 12.82051282051282, 0.0, 0.0], "isController": false}, {"data": ["Get the List of Default config for the Departments", 100, 0, 0.0, 18644.17, 403, 45349, 19671.0, 37426.3, 38925.2, 45312.36999999998, 0.13694540534470528, 0.23173730310674348, 0.14686859780230013], "isController": false}, {"data": ["Get List of Zones", 100, 0, 0.0, 16997.690000000002, 655, 45698, 14700.5, 36374.8, 38667.6, 45670.72999999999, 0.1338209769734245, 6.935843223121721, 0.14981676562727914], "isController": false}, {"data": ["Search Containers for List For Map", 100, 79, 79.0, 58712.56999999999, 12107, 60862, 60167.0, 60353.9, 60379.0, 60858.18, 0.1330417059139699, 0.08634198836151157, 0.14310168568830456], "isController": false}, {"data": ["Get list of Tasks", 100, 31, 31.0, 37978.22, 383, 60403, 41743.5, 60346.9, 60360.8, 60402.79, 0.1399897527500987, 0.42174373773339796, 0.15686371288871656], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 712, 100.0, 39.55555555555556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 712, "504/Gateway Time-out", 712, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get List of Containers", 100, 42, "504/Gateway Time-out", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get List of Alert Profiles", 100, 16, "504/Gateway Time-out", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get List of Department", 100, 89, "504/Gateway Time-out", 89, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get the List of Alerts", 100, 26, "504/Gateway Time-out", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get List of Regions", 100, 69, "504/Gateway Time-out", 69, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get the List of Alerts For Map", 100, 34, "504/Gateway Time-out", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search Rule", 100, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get List of Cities", 100, 68, "504/Gateway Time-out", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Users", 100, 76, "504/Gateway Time-out", 76, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search Devices for List For Map", 100, 66, "504/Gateway Time-out", 66, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search Zones for List For Map", 100, 74, "504/Gateway Time-out", 74, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get List of Devices", 100, 37, "504/Gateway Time-out", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Containers for List For Map", 100, 79, "504/Gateway Time-out", 79, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get list of Tasks", 100, 31, "504/Gateway Time-out", 31, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
