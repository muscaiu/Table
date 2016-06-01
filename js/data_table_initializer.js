// //Usage
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
                body: function (data, column, row){
                    return column === 4 ?
                    //data.replace( /[test]/, 'REPLACED' ) :
                    data.replace( 'test', 'REPLACED' ) :
                    data;
                }
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
            /************** EXPORT CSV ALL **************/
            $.extend(true, {}, buttonExp, {
                extend: 'csvHtml5',
                text: 'CSV ALL',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                },                
                footer: true
            }),
            /************** EXPORT CSV Selected **************/
            $.extend(true, {}, buttonExp, {
                extend: 'csvHtml5',
                text: 'CSV Selected',
                exportOptions: {                    
                    modifier: {
                        page: 'current',
                        selected: true
                    }
                },
                footer : true
            }),
            
            /************** EXPORT XLS ALL **************/
            $.extend(true, {}, buttonExp, {
                extend: 'excelHtml5',
                text: 'XLS ALL',
                exportOptions: {
                    //orthogonal: 'export',
                    modifier: {
                        page: 'current'
                    }
                },
                footer: true,
                // customize: function ( xslx ) {
                //     var sheet = xlsx.xl.worksheets['sheet1.xml']; 
                //     $('c[r=A1] t', sheet).text( 'Custom text' );
                // }
            }),
            /************** EXPORT XLS Selected **************/
                $.extend(true, {}, buttonExp, {
                extend: 'excelHtml5',
                text: 'XLS Selected',
                exportOptions: {                    
                    modifier: {
                        page: 'current',
                        selected: true
                    }
                },
                footer : true
            }),

            // $.extend(true, {}, buttonExp, {
            //    extend: 'pdfHtml5',
            //    footer: true
            // }),
        ],
        oSelectorOpts: { filter: 'applied', order: 'current' },


        /***************** <START> Footer SUM ******************/
        footerCallback: function (row, data, start, end, display) {
            // Remove the formatting to get integer data for summation
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


            var tempo = this.api();
            //total for all pages
            var tempoTotal = tempo.column(3)
                .data()
                .sum();
            tempoTotal = tempoTotal.toString();

            while (tempoTotal.length != 6) {
                tempoTotal = "0" + tempoTotal
            }

            tempoTotal = tempoTotal.replace(/^(\d+)(\d{2})(\d{2})$/, function (m, m1, m2, m3) {
                m1 = Number(m1);
                m2 = Number(m2);
                m2 += parseInt(m3 / 60, 10);
                m3 = m3 % 60;
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
            while (tempoPage.length != 6) {
                tempoPage = "0" + tempoPage
            }
            tempoPage = tempoPage.replace(/^(\d+)(\d{2})(\d{2})$/, function (m, m1, m2, m3) {
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
        },
        /***************** DropDowns ******************/
        // initComplete: function () {
        //     this.api().columns().every( function () {
        //         var column = this;
        //         var select = $('<select class="form-control"><option value=""></option></select>')
        //             .appendTo( $(column.header()))
        //             .on( 'change', function () {
        //                 var val = $.fn.dataTable.util.escapeRegex(
        //                     $(this).val()
        //                 );

        //                 column
        //                     .search( val ? '^'+val+'$' : '', true, false )
        //                     .draw();
        //             } );

        //         column.data().unique().sort().each( function ( d, j ) {
        //             select.append( '<option value="'+d+'">'+d+'</option>' )
        //         } );
        //     } );


        // var buttonExp = {
        //     exportOptions: {
        //         format: {
        //         header: function ( data, column, row ) {
        //             return header[column]; //header is the array I used to store header texts
        //         }
        //         }
        //     }
        //     };
        // var header = [];
        //         header.push("id");
        //         header.push("id_op");
        //         header.push("tipo_lav");
        // new $.fn.dataTable.Buttons( table, {
        //         "buttons": [$.extend( true, {}, buttonExp, {
        //                 extend: 'excelHtml5'
        //             })]
        //         });

        // table.buttons(0,null).containers().appendTo('#containerId');
        //}
        initComplete: function () {
            //var api = this.api();
            //this.api().columns().eq(0).each(function (index) {
            this.api().columns().every( function () {
                //if (index == 1 || index == 4) {
                    var column = this;
                    var select = $('<select class="form-control"><option value=""></option></select>')
                        //.appendTo($(api.column(index).header()))
                        .appendTo( $(column.header()))
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );

                            column
                                //.row(index).data()
                                //.search( val ? val : '', true, false )
                                .search(val ? '^' + val + '$' : '', true, false)                                
                                .draw();
                        });
                    var i = 0;
                    //api.column(index).data().unique().sort().each(function (d, j) {
                        column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    });
                //}
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