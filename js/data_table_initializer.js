$(document).ready(function () {
    var header = [];
    header.push("id");
    header.push("id_op");
    header.push("tipo_lav");
    header.push("tempo_new");
    header.push("motivazione");
    header.push("quantita");
    header.push("data");

    //format header using the array and column index
    var buttonExp = {
        exportOptions: {
            format: {
                header: function (data, column, row) {
                    return header[column]; //header is the array I used to store header texts
                },                
            }
        }
    };

    var table = $('#myTable').DataTable({
        select: true,
        stateSave: true,
        iDisplayLength: 10,
        pagingType: "full_numbers",
        lengthMenu: [[10, 50, 100, -1], [10, 50, 100, "All"]],
        dom: 'lfBrtip',   
        buttons: [
            { extend: 'collection',
                text: 'Export',
                buttons: [
/************** COPY ALL **************/
                    $.extend(true, {}, buttonExp, {
                        extend: 'copyHtml5',
                        text: 'Copy ALL',
                        footer: true,
                    }),
/************** Copy Selected **************/
                        $.extend(true, {}, buttonExp, {
                        extend: 'copyHtml5',
                        text: 'Copy Selected',
                        exportOptions: {                    
                            modifier: {
                                selected: true
                            }
                        },
                        footer : true
                    }),
/************** EXPORT XLS ALL **************/
                    $.extend(true, {}, buttonExp, {
                        extend: 'excelHtml5',
                        text: 'Export XLSX ALL',
                        footer: true,
                        // customize: function ( xslx ) {
                        //     var sheet = xlsx.xl.worksheets['sheet1.xml']; 
                        //     $('c[r=A1] t', sheet).text( 'Custom text' );
                        // }
                    }),
/************** EXPORT XLS Selected **************/
                        $.extend(true, {}, buttonExp, {
                        extend: 'excelHtml5',
                        text: 'Export XLSX Selected',
                        exportOptions: {                    
                            modifier: {
                                //page: 'current',
                                selected: true
                            }
                        },
                        footer : true
                    }),
                    
/************** EXPORT CSV ALL **************/
                    $.extend(true, {}, buttonExp, {
                        extend: 'csvHtml5',
                        text: 'Export CSV ALL',
                        fieldSeparator: ';',
                        extension: '.csv',          
                        footer: true,
                        exportOptions: {                    
                            modifier: {
                                //page: 'current',
                            }
                        },
                    }),
/************** EXPORT CSV Selected **************/
                    $.extend(true, {}, buttonExp, {
                        extend: 'csvHtml5',
                        text: 'Export CSV Selected',
                        fieldSeparator: ';',
                        extension: '.csv',
                        exportOptions: {                    
                            modifier: {
                                //page: 'current',
                                selected: true
                            }
                        },
                        footer : true
                    }),
/************** EXPORT PDF ALL **************/
                    $.extend(true, {}, buttonExp, {
                        extend: 'pdfHtml5',
                        text: 'Export PDF ALL',   
                        footer: true
                    }),
/************** EXPORT PDF Selected **************/
                    $.extend(true, {}, buttonExp, {
                        extend: 'pdfHtml5',
                        text: 'Export PDF Selected',
                        exportOptions: {                    
                            modifier: {
                                selected: true
                            }
                        },
                        footer : true
                    }),
                ]
            } 
        ],
        oSelectorOpts: { filter: 'applied', order: 'current' },


/***************** <START> Footer SUM ******************/
        footerCallback: function (row, data, start, end, display) {
/***************** Quantita SUM ******************/
            var intVal = function (i) {
                return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ? i : 0;
            };
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

/***************** Tempo SUM ******************/
            var tempo = this.api();

            //total for all pages
            var tempoTotal = tempo.column(3)
                .data()
                .sumTime();
            tempoTotal = tempoTotal.toString();

            while (tempoTotal.length < 6) {
                tempoTotal = "0" + tempoTotal
            }

            tempoTotal = tempoTotal.replace(/^(\d+)(\d{2})(\d{2})$/, function (m, m1, m2, m3) {
                m1 = Number(m1);
                m2 = Number(m2);
                m2 += parseInt(m3 / 60, 10);
                m3 = m3 % 60; // get soconds
                m1 += parseInt(m2 / 60, 10); // get hours
                m2 = m2 % 60; // get minutes                
                //convert back to string
                m1 = m1.toString();            
                m2 = m2.toString();
                m3 = m3.toString();

                while (m1.length < 2){
                    m1 = '0' + m1
                }
                while (m2.length < 2){
                    m2 = '0' + m2
                }
                while (m3.length < 2){
                    m3 = '0' + m3
                }                

                // add 0 to minute and second if single digit , slice(-2) will select last 2 digit
                return m1 + ':' + 
                      m2.slice(-2) + ':' + 
                      m3.slice(-2);
            })

            //total for current page
            var tempoPage = tempo.column(3, { page: 'current' })
                .data()
                .sumTime();
            tempoPage = tempoPage.toString();
            while (tempoPage.length < 6) {
                tempoPage = "0" + tempoPage
            }
            tempoPage = tempoPage.replace(/^(\d+)(\d{2})(\d{2})$/, function (m, m1, m2, m3) {
                m1 = Number(m1);
                m2 = Number(m2);
                m2 += parseInt(m3 / 60, 10);
                m3 = m3 % 60; // get soconds
                m1 += parseInt(m2 / 60, 10); // get hours
                m2 = m2 % 60; // get minutes                
                //convert back to string
                m1 = m1.toString();            
                m2 = m2.toString();
                m3 = m3.toString();

                while (m1.length < 2){
                    m1 = '0' + m1
                }
                while (m2.length < 2){
                    m2 = '0' + m2
                }
                while (m3.length < 2){
                    m3 = '0' + m3
                }                

                // add 0 to minute and second if single digit , slice(-2) will select last 2 digit
                return m1 + ':' + 
                      m2.slice(-2) + ':' + 
                      m3.slice(-2);
            })


            //write in footer
            $(tempo.column(3)
                .footer())
                .html(
                tempoPage + ' (' + tempoTotal + ' total)');
        },
        /***************** DropDowns ******************/
        initComplete: function () {            
            this.api().columns().every( function () {
                    var column = this;
                    var select = $('<select class="form-control"><option value=""></option></select>')
                        .appendTo( $(column.header()))
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search(val ? '^' + val + '$' : '', true, false)                                
                                .draw();
                        });
                    var i = 0;
                        column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    });
            });
        }
    });

    /************ <END> Footer SUM ****************/
    // Redraw Table on inputs click
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

    //STOP Resorting when clicking on Dropdown
    $("thead th").each(function (i) {
        $('select', this).click(function (event) {
            event.stopPropagation();
        });
    });   

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
// jQuery.fn.dataTable.Api.register('sum()', function () {
//     return this.flatten().reduce(function (a, b) {
//         if (typeof a === 'string') {
//             a = a.replace(/[^\d]/g, '') * 1;
//         }
//         if (typeof b === 'string') {
//             b = b.replace(/[^\d]/g, '') * 1;
//         }
//         return a + b;
//     }, 0);
// });

jQuery.fn.dataTable.Api.register( 'sumTime()', function ( ) {
  function sum(x) {
    return x > 9 ? x.toString() : '0' + x.toString()
  }
  var t, hours = 0, mins = 0, secs = 0;
  for (var i=0; i<this.length; i++) {
    t = this[i].split(':')
    hours += parseInt(t[0])
    mins += parseInt(t[1])
    if (mins>60) {
       mins -= 60
       hours += 1
    }
    secs += parseInt(t[2])
    if (secs>60) {
       secs -= 60
       mins += 1
    }
  }  
  return sum(hours) + ':' + sum(mins) + ':' + sum(secs)
})