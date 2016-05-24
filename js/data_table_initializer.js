// //Usage
$(document).ready(function() {   
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
                oSelectorOpts: { filter: 'applied', order: 'current'} ,

// <START> Code for Footer SUM/////////////
                footerCallback: function ( row, data, start, end, display ) {
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ? i.replace(/[\$,]/g, '')*1 :
                               typeof i === 'number' ? i : 0;
                         };                                                                      
   
                    // var tempo_new = this.api(), data;
                    // // Total tempo_new over all pages
                    // total_tempo_new = tempo_new 
                    //     .column( 3 )
                    //     .data()
                    //     .reduce( function (a, b) {
                    //         return intVal(a) + intVal(b);
                    //     }, 0 ); 
                        
                    // // Total tempo_new over this page
                    // pageTotal_tempo_new = tempo_new
                    //     .column( 3, { page: 'current'} )
                    //     .data()
                    //     .reduce( function (a, b) {
                    //         return intVal(a) + intVal(b);
                    //     }, 0 ); 
                        
                    // //Solution 1 - OK
                    // //Moment.js, Moment.duration.js for hh:mm:ss transformation
                    // //For Current Page
                    // var time_min = total_tempo_new;
                    // time_min =  parseInt(time_min) + (time_min * 60 % 60) / 60;
                    // console.log(time_min);
                    // var Total_format_time = moment.duration(time_min ,'minutes').
                    //                         format("HH:mm:ss", {trim:false});
                    // //For Total Pages
                    // var page_time_min = pageTotal_tempo_new;
                    // page_time_min =  parseInt(page_time_min)+ (page_time_min * 60 % 60) / 60;
                    // var pageTotal_format_time = moment.duration(page_time_min ,'minutes').
                    //                             format("HH:mm:ss", {trim:false}); 
                    // // // Update footer Column "tempo_new"
                    // $( tempo_new.column( 3 ).footer() ).html(
                    //     pageTotal_format_time +' ('+ Total_format_time +' total)'
                    // );                                                                 

                    var quantita = this.api(), data;
                    total_quantita = quantita
                        .column( 5 )
                        .data()
                        .reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 ); 

                    pageTotal_quantita = quantita
                        .column( 5, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );                        

                    $( quantita.column( 5 ).footer() ).html(
                    pageTotal_quantita +' ('+ total_quantita +' total)'
                    );
                    
                    var tempo_api = this.api();
                    var total = tempo_api.column(3).data().sum();
                    var pageTotal = tempo_api.column(3, {page:'current'}).data().sum();
                    $(tempo_api.column(3).footer()).html(pageTotal + ' (' + total + ' total)');                                    
                }
                });	
// </END> Code for Footer SUM/////////////
	
    // Add event listeners to the two range filtering inputs
    $('#from').change( function() { 
        table.draw(); } );
    $('#to').change( function() { 
        table.draw(); } );
    $('#myTable_length').change( function() {
        table.draw(); } );       
    
    //Enable Search ONLY for column 0,1,2,3,4,5 (only option found!) 
    //By overwriting the search method
    $('.dataTables_filter input').unbind().on('keyup', function() {
        var searchTerm = this.value.toLowerCase();
        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) 
            {
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
} );


//Date Range Picker
$(function() {
    $( "#from" ).datepicker({
      dateFormat: 'yy-mm-dd',
      defaultDate: "+1w",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $( "#to" ).datepicker({
      dateFormat: 'yy-mm-dd',
      defaultDate: "+1w",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
});

//Code behind Date Range Picker
$.fn.dataTableExt.afnFiltering.push(
	function( oSettings, aData, iDataIndex ) {
		var iFini = document.getElementById('from').value;
		var iFfin = document.getElementById('to').value;
		var iStartDateCol = 6;
		var iEndDateCol = 6;
		//year + month + day
		iFini=iFini.substring(0,4) + iFini.substring(5,7)+ iFini.substring(8,10);
		iFfin=iFfin.substring(0,4) + iFfin.substring(5,7)+ iFfin.substring(8,10);

		var datofini=aData[iStartDateCol].substring(0,4) + aData[iStartDateCol].substring(5,7)+ aData[iStartDateCol].substring(8,10);
		var datoffin=aData[iEndDateCol].substring(0,4) + aData[iEndDateCol].substring(5,7)+ aData[iEndDateCol].substring(8,10);       
        
		if ( iFini === "" && iFfin === "" )
		{
			return true;
		}
		else if ( iFini <= datofini && iFfin === "")
		{
			return true;
		}
		else if ( iFfin >= datoffin && iFini === "")
		{
			return true;
		}
		else if (iFini <= datofini && iFfin >= datoffin)
		{
			return true;
		}
		return false;
	}
);


/********************** SUM PLUGIN ***********************
 * Fairly simply, this plug-in will take the data from an API result set
 * and sum it, returning the summed value. The data can come from any data
 * source, including column data, cells or rows.
 *
 * Note that it will attempt to 'deformat' any string based data that is passed
 * into it - i.e. it will strip any non-numeric characters in order to make a
 * best effort attempt to sum all data types. This can be useful when working
 * with formatting numbers such as currency. However the trade-off is that no
 * error is thrown if non-numeric data is passed in. You should be aware of this
 * in case unexpected values are returned - likely the input data is not what is
 * expected.
 *
 *  @name sum()
 *  @summary Sum the values in a data set.
 *  @author [Allan Jardine](http://sprymedia.co.uk)
 *  @requires DataTables 1.10+
 *
 *  @returns {Number} Summed value
 *
 *  @example
 *    // Simply get the sum of a column
 *    var table = $('#example').DataTable();
 *    table.column( 3 ).data().sum();
 *
 *  @example
 *    // Insert the sum of a column into the columns footer, for the visible
 *    // data on each draw
 *    $('#example').DataTable( {
 *      drawCallback: function () {
 *        var api = this.api();
 *        $( api.table().footer() ).html(
 *          api.column( 4, {page:'current'} ).data().sum()
 *        );
 *      }
 *    } );
 */

jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
	return this.flatten().reduce( function ( a, b ) {
		if ( typeof a === 'string' ) {
			a = a.replace(/[^\d.-]/g, '') * 1;
		}
		if ( typeof b === 'string' ) {
			b = b.replace(/[^\d.-]/g, '') * 1;
		}

		return a + b;
	}, 0 );
} );