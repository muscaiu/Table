// //Usage
$(document).ready(function () {
    var table = $('#myTable').DataTable({
        stateSave: true,
        iDisplayLength: 10,
        pagingType: "full_numbers",
        lengthMenu: [[10, 50, 100, -1], [10, 50, 100, "All"]],
        dom: 'lfBrtip',
        buttons: [
            {
                extend: 'copy',
                footer: true
            },
            {
                extend: 'csv',
                footer: true
            },
            {
                extend: 'excel',
                footer: true
            },
            {
                extend: 'pdf',
                footer: true
            }
        ],
        oSelectorOpts: { filter: 'applied', order: 'current' },

/***************** <START> Footer SUM ******************/
        footerCallback: function (row, data, start, end, display) {
            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ? i : 0;
            };                                                         
       /*********** sum Quantita **********/
            var quantita = this.api(), data;
            total_quantita = quantita
                .column(5)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            pageTotal_quantita = quantita
                .column(5, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            $(quantita.column(5)
                .footer())
                .html(pageTotal_quantita + ' (' + total_quantita + ' total)');

       /*********** sum Tempo **********/
            var tempo = this.api();
            //total for all pages
            var tempoTotal = tempo.column(3)
                    .data()
                    .sum();            
            tempoTotal = tempoTotal.toString();        
            tempoTotal = tempoTotal.replace(/^(\d+)(\d{2})(\d{2})$/, function(m, m1, m2, m3) {
                m1 = Number(m1); // convert captured group value to number
                m2 = Number(m2);
                m2 += parseInt(m3 / 60, 10); // get minutes from second and add it to minute
                m3 = m3 % 60; // get soconds
                m1 += parseInt(m2 / 60, 10); // get minutes from minute and add it to hour
                m2 = m2 % 60; // get minutes
                // add 0 to minute and second if single digit , slice(-2) will select last 2 digit
                return m1 + ':' + ('0' + m2).slice(-2) + ':' + ('0' + m3).slice(-2); // return updated string
            })
            //total for current page
            var tempoPage = tempo.column(3, { page: 'current' })
                .data()
                .sum();  
            tempoPage = tempoPage.toString();        
            tempoPage = tempoPage.replace(/^(\d+)(\d{2})(\d{2})$/, function(m, m1, m2, m3) {
                    m1 = Number(m1); // convert captured group value to number
                    m2 = Number(m2);
                    m2 += parseInt(m3 / 60, 10); // get minutes from second and add it to minute
                    m3 = m3 % 60; // get soconds
                    m1 += parseInt(m2 / 60, 10); // get minutes from minute and add it to hour
                    m2 = m2 % 60; // get minutes
                    // add 0 to minute and second if single digit , slice(-2) will select last 2 digit
                    return m1 + ':' + ('0' + m2).slice(-2) + ':' + ('0' + m3).slice(-2); // return updated string
            })
                            
            //write in footer
            $(tempo.column(3)
                .footer())
                .html(
                tempoPage + ' (' + tempoTotal + ' total)');
        }
    });    

    
/************ <END> Footer SUM ****************/
    
    // Add event listeners to the two range filtering inputs
    $('#from').change(function () {
        table.draw();
    });
    $('#to').change(function () {
        table.draw();
    });
    $('#myTable_length').change(function () {
        table.draw();
    });

    //Enable Search ONLY for column 0,1,2,3,4,5 (only option found!) 
    //By overwriting the search method
    $('.dataTables_filter input').unbind().on('keyup', function () {
        var searchTerm = this.value.toLowerCase();
        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            if (~data[0].toLowerCase().indexOf(searchTerm)) return true;
            if (~data[1].toLowerCase().indexOf(searchTerm)) return true;
            if (~data[2].toLowerCase().indexOf(searchTerm)) return true;
            if (~data[3].toLowerCase().indexOf(searchTerm)) return true;
            if (~data[4].toLowerCase().indexOf(searchTerm)) return true;
            if (~data[5].toLowerCase().indexOf(searchTerm)) return true;
            return false;
        })
        table.draw();
        $.fn.dataTable.ext.search.pop();
    })
});


//Date Range Picker
$(function () {
    $("#from").datepicker({
        dateFormat: 'yy-mm-dd',
        //defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        onClose: function (selectedDate) {
            $("#to").datepicker("option", "minDate", selectedDate);
        }
    });
    $("#to").datepicker({
        dateFormat: 'yy-mm-dd',
        //defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        onClose: function (selectedDate) {
            $("#from").datepicker("option", "maxDate", selectedDate);
        }
    });
});

//Code behind Date Range Picker
$.fn.dataTableExt.afnFiltering.push(
    function (oSettings, aData, iDataIndex) {
        var iFini = document.getElementById('from').value;
        var iFfin = document.getElementById('to').value;
        var iStartDateCol = 6;
        var iEndDateCol = 6;
        //year + month + day
        iFini = iFini.substring(0, 4) + iFini.substring(5, 7) + iFini.substring(8, 10);
        iFfin = iFfin.substring(0, 4) + iFfin.substring(5, 7) + iFfin.substring(8, 10);

        var datofini = aData[iStartDateCol].substring(0, 4) + aData[iStartDateCol].substring(5, 7) + aData[iStartDateCol].substring(8, 10);
        var datoffin = aData[iEndDateCol].substring(0, 4) + aData[iEndDateCol].substring(5, 7) + aData[iEndDateCol].substring(8, 10);

        if (iFini === "" && iFfin === "") {
            return true;
        }
        else if (iFini <= datofini && iFfin === "") {
            return true;
        }
        else if (iFfin >= datoffin && iFini === "") {
            return true;
        }
        else if (iFini <= datofini && iFfin >= datoffin) {
            return true;
        }
        return false;
    }
);


/********************** SUM PLUGIN ***********************/
jQuery.fn.dataTable.Api.register('sum()', function () {
    return this.flatten().reduce(function (a, b) {
        if (typeof a === 'string') {
            a = a.replace(/[^\d.-]/g, '') * 1;
        }
        
        if (typeof b === 'string') {
            b = b.replace(/[^\d.-]/g, '') * 1;
        }
        return a + b;
    }, 0);
});