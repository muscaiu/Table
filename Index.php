<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Table</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

<!--Styles-->
  <link rel="stylesheet" href="css/bootstrap.min.css">  
  <link rel="stylesheet" href="css/buttons.dataTables.css">  
  <link rel="stylesheet" href="css/jquery.dataTables.css">
  <link rel="stylesheet" href="css/jquery-ui.min.css">
  <link rel="stylesheet" href="css/styles.css">
  
<!--Script Bootstrap & jQuery-->
  <script src="js/jquery-1.12.3.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
 <!--Script jQueryUi for Calendar look and feel-->
  <script src="js/jquery-ui.min.js"></script>
<!--Script jQuery DataTables to display Table -->
  <script src="js/jquery.dataTables.js"></script>  
<!--Script for Date Range Filter -->
  <script src="js/data_table_initializer.js"></script>      
<!--Scripts For Export Buttons -->
  <script src="js/buttons.html5.min.js"></script>  
  <script src="js/dataTables.buttons.min.js"></script>  
  <script src="js/jszip.min.js"></script>  
  <script src="js/pdfmake.min.js"></script>  
  <script src="js/vfs_fonts.js"></script> 
<!--Scripts import Moment.js for data_table_initialize time format-->
  <script src="js/moment.js"></script> 
  <script src="js/moment-duration-format.min.js"></script>   
</head>

<body>
<!--Filter by Date-->
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="range_search">
        <label for="from">From</label>
        <input type="text" id="from" >
        <label for="to">to</label>
        <input type="text" id="to" >
      </div>
<!--Table-->
        <table id="myTable" class="display table table-bordered" cellspacing="10">
          <thead>
            <tr>
              <th>id</th>
              <th>id_op</th>
              <th>tipo_lav</th>
              <th>tempo_new</th>
              <th>motivazione</th>
              <th>quantita</th>
              <th>data</th>
            </tr>
          </thead>
          
          <tfoot>
             <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
             </tr>
          </tfoot>
          
          <tbody>
<!--Rest of table comes from table.php -->
            <?php include 'table.php';?>
          </tbody>
      </table>
	  </div>
  </div>
</body>	


</html>