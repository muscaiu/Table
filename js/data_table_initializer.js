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
       },     
    ], 
           oSelectorOpts: { filter: 'applied', order: 'current'} ,	
             "columns": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        { "searchable": false }
                    ],	

// <START> Code for Footer SUM/////////////
           "footerCallback": function ( row, data, start, end, display ) {
                var tempo_new = this.api(), data;
                var quantita = this.api(), data;
    
                // Remove the formatting to get integer data for summation
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                            };    
                // Total tempo_new over all pages
                total_tempo_new = tempo_new
                    .column( 3 )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 ); 
                // Total tempo_new over this page
                pageTotal_tempo_new = tempo_new
                    .column( 3, { page: 'current'} )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 ); 
                    
                //Solution 1 - OK
                //Moment.js, Moment.duration.js for hh:mm:ss transformation
                //For Current Page
                var time_min = total_tempo_new;
                time_min =  parseInt(time_min) + (time_min * 60 % 60) / 60;
                var Total_format_time = moment.duration(time_min ,'minutes').format("HH:mm:ss", {trim:false});     
                //For Total Pages
                var page_time_min = pageTotal_tempo_new;
                page_time_min =  parseInt(page_time_min)+ (page_time_min * 60 % 60) / 60;
                var pageTotal_format_time = moment.duration(page_time_min ,'minutes').format("HH:mm:ss", {trim:false}); 
                
                //Solution 2 - OK
                // var value = total_tempo_new;
                // var minutes = Math.floor(value)
                // var seconds = (value - minutes) * 100;
                // var duration = moment.duration(minutes, 'minutes').add(seconds, 'seconds');
                // var format_time = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
                
                // Update footer Column "tempo_new"
                $( tempo_new.column( 3 ).footer() ).html(
                    pageTotal_format_time +' ('+ Total_format_time +' total)'
                );
                
                // Total quantita over all pages
                total_quantita = quantita
                    .column( 5 )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 ); 
                // Total quantita over this page
                pageTotal_quantita = quantita
                    .column( 5, { page: 'current'} )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 ); 
                // Update footer Column "quantita"
                $( quantita.column( 5 ).footer() ).html(
                pageTotal_quantita +' ('+ total_quantita +' total)'
                );
                            
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
} );

//Date Range Picker
  $(function() {
    $( "#from" ).datepicker({
      dateFormat: 'yy-mm-dd',
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $( "#to" ).datepicker({
      dateFormat: 'yy-mm-dd',
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
  });

//Code behind
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

$(document).ready(function() {
    var hours = Math.floor( $('.totalMin').html() / 60);          
    var minutes = $('.totalMin').html() % 60;


    $('.convertedHour').html(hours);
    $('.convertedMin').html(minutes);    

});