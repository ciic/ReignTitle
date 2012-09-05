/**
 * Created with JetBrains WebStorm.
 * User: ciic
 * Date: 12-9-5
 * Time: 下午1:11
 * To change this template use File | Settings | File Templates.
 */


function tableToJson(table) {
    var data = [];

    // first row needs to be headers
    var headers = [];
    for (var i=0; i<table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerText.toLowerCase().replace(/ /gi,'');
        if(headers[i]=="姓名"){
            headers[i]="\"name\"";
        }else if(headers[i]=="庙号"){
            headers[i]="\"templename\"";
        }else if(headers[i]=="谥号"){
            headers[i]="\"posthumoustitle\"";
        }else if(headers[i]=="年号"){
            headers[i]="\"reigntitle\"";
        }else if(headers[i]=="陵墓"){
            headers[i]="\"lingmu\"";
        }

    }

    // go through cells
    for (var i=1; i<table.rows.length; i++) {

        var tableRow = table.rows[i];
        var rowData = {};

        for (var j=0; j<tableRow.cells.length; j++) {

            rowData[ headers[j] ] = tableRow.cells[j].innerText;

        }

        data.push(rowData);
    }

    return data;
}

function arrayToJson(o) {
    var r = [];
    if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push(i + ":" + arrayToJson(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(arrayToJson(o[i]));
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}