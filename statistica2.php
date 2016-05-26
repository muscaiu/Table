<?php
include('session.php');

function decimal_to_time($decimal) {
    $hours = floor($decimal / 60);
    $minutes = floor($decimal % 60);
    $seconds = $decimal - (int)$decimal;
    $seconds = round($seconds * 60);
 
    return str_pad($hours, 2, "0", STR_PAD_LEFT) . ":" . str_pad($minutes, 2, "0", STR_PAD_LEFT) . ":" . str_pad($seconds, 2, "0", STR_PAD_LEFT);
    //return str_pad($minutes, 2, "0", STR_PAD_LEFT) . ":" . str_pad($seconds, 2, "0", STR_PAD_LEFT); 
}
function split_data($data){
    $arr_data_i=explode("-",$data);
    //converto mese in numero
    switch ($arr_data_i[1]){
        case ("Jan"): $mese="01";break;
        case ("Feb"): $mese="02";break;
        case ("Mar"): $mese="03";break;
        case ("Apr"): $mese="04";break;
        case ("May"): $mese="05";break;
        case ("Jun"): $mese="06";break;
        case ("Jul"): $mese="07";break;
        case ("Aug"): $mese="08";break;
        case ("Sep"): $mese="09";break;
        case ("Oct"): $mese="10";break;
        case ("Nov"): $mese="11";break;
        case ("Dec"): $mese="12";break;
    }
    
    return $arr_data_i[2]."-".$mese."-".$arr_data_i[0];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if($_POST['action'] == "SubmitForm"){
        $cond=" where 1 ";
        $id_ope_sel=$_POST['oper'];
        //$id_lav_sel=$_POST['lavoraz'];
        $id_cli_sel=$_POST['clien'];
        $id_att_sel=$_POST['attiv'];
        $id_cat_sel=$_POST['categ'];
        $data_inizio=$_POST['data_i'];
        $data_fine=$_POST['data_f'];
        $data_inizio=split_data($data_inizio);
        $data_fine=split_data($data_fine);
        
        if (!empty($id_ope_sel)){
            $cond.=" and (lavorazioni.id_operatore=".$id_ope_sel.")";
        }
//        if (!empty($id_lav_sel)){
//            $cond.=" and (lavorazioni.id_tipo_lavorazione=".$id_lav_sel.")";
//        }
        if (!empty($id_cli_sel)){
            $cond.=" and (clienti.id=".$id_cli_sel.")";
        }
        if (!empty($id_att_sel)){
            $cond.=" and (attivita.id=".$id_att_sel.")";
        }
        if (!empty($id_cat_sel)){
            $cond.=" and (categoria.id=".$id_cat_sel.")";
        }
        if ((!empty($data_i))&&(!empty($data_f))){
            //$cond.=" and (lavorazioni.data_ins=".$data_i.")";
            $cond.=" and (date(lavorazioni.data_ins) between '".$data_inizio."' and '".$data_fine."')";
        }
        if ((!empty($data_i))&&(empty($data_f))){
            //$cond.=" and (lavorazioni.data_ins=".$data_i.")";
            $cond.=" and date(lavorazioni.data_ins) >= '".$data_inizio."'";
        }
        if ((empty($data_i))&&(!empty($data_f))){
            //$cond.=" and (lavorazioni.data_ins=".$data_i.")";
            $cond.=" and date(lavorazioni.data_ins) <= '".$data_fine."'";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Statistica</title>
<!--  <meta charset="utf-8">-->
  <meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1">
  <meta name="viewport" content="width=device-width, initial-scale=1">

<!--Styles-->
  <link href="style.css" rel="stylesheet" type="text/css">
  
<!--Calendar-->
<link rel="stylesheet" type="text/css" href="calendar/datepicker.css" /> 
<script type="text/javascript" src="calendar/datepicker.js"></script>

</head>

<body>
    <div id="profile">
            <b id="welcome">Benvenuto/a : <i><?php echo ucfirst($login_session); ?></i></b>
            <b id="welcome">Livello : <i><?php echo ucfirst($livello_session); ?></i></b>
            <b id="logout"><a href="logout.php">Log Out</a></b>
    </div>
    <div>
        <?php include('menu.php');?>
    </div>
    <div id="profile_stat">
        <div id="elenco_stat" class="center">
        <h3 align="center"><b>Elenco</b></h3>
            <div>
              <div>
                  <form method="post" name="ricerca"  action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                  <table class="tabellina">
                      <tr>
<!--                          <td>Da</td><td><input type="text"></td>
                          <td>A</td><td><input type="text"></td>-->
                          <td>Da</td><td><input id='start_dt' class='datepicker' name='data_i' value='<?php if (!empty($_POST['data_i'])){ echo $_POST['data_i'];}?>'></td>
                          <td>A</td><td><input id='another_dt' class='myclass datepicker' name='data_f' value='<?php if (!empty($_POST['data_f'])){ echo $_POST['data_f'];}?>'></td>
                      </tr>
                      <tr>
                          <td>Operatore</td><td>
                            <select name="oper" style="font-size:12px; font-family:raleway; margin-top:10px; margin-bottom:15px;">
                                <?php 
                                $RsCourse = mysql_query("select id,username from login order by username", $connection);?>
                                <option value="">--</option>
                                <?php while ($row = mysql_fetch_array($RsCourse)){
                                $selected="";
                                $id_ope=$row['id'];
                                $descr_ope=$row['username'];
                                if ($id_ope==$id_ope_sel) $selected=" SELECTED ";
                                ?>                                
                                <option value="<?=$id_ope?>" <?=$selected?>><?=$descr_ope?></option>
                                <?php
                                }
                                mysql_free_result($RsCourse);
                                ?>
                            </select>
                          </td>
                      </tr>
                      <tr>
<!--                          <td>Lavorazione</td><td>
                            <select name="lavoraz" style="font-size:12px; font-family:raleway; margin-top:10px; margin-bottom:15px;">
                                <?//php 
                                $RsCourse = mysql_query("select id,descr from tipo_lavorazione order by descr", $connection);?>
                                <option value="">--</option>
                                <?//php while ($row = mysql_fetch_array($RsCourse)){
                                $selected="";
                                $id_lav=$row['id'];
                                $descr_lav=$row['descr'];
                                if ($id_lav==$id_lav_sel) $selected=" SELECTED ";
                                ?>
                                <option value="<?//=$id_lav?>" <?//=$selected?>><?//=$descr_lav?></option>
                                <?//php
                                //}
                                mysql_free_result($RsCourse);
                                ?>
                            </select>
                          </td>-->
                          <td>Cliente</td><td>
                            <select name="clien" style="font-size:12px; font-family:raleway; margin-top:10px; margin-bottom:15px;">
                                <?php 
                                $RsCourse = mysql_query("select id,descr from clienti order by descr", $connection);?>
                                <option value="">--</option>
                                <?php while ($row = mysql_fetch_array($RsCourse)){
                                $selected="";
                                $id_cli=$row['id'];
                                $descr_cli=$row['descr'];
                                if ($id_cli==$id_cli_sel) $selected=" SELECTED ";
                                ?>
                                <option value="<?=$id_cli?>" <?=$selected?>><?=$descr_cli?></option>
                                <?php
                                }
                                mysql_free_result($RsCourse);
                                ?>
                            </select>
                          </td>
                      </tr>
                      <tr>                          
                          <td>Attività</td><td>
                            <select name="attiv" style="font-size:12px; font-family:raleway; margin-top:10px; margin-bottom:15px;">
                                <?php 
                                $RsCourse = mysql_query("select id,descr from attivita order by descr", $connection);?>
                                <option value="">--</option>
                                <?php while ($row = mysql_fetch_array($RsCourse)){
                                $selected="";
                                $id_att=$row['id'];
                                $descr_att=$row['descr'];
                                if ($id_att==$id_att_sel) $selected=" SELECTED ";
                                ?>
                                <option value="<?=$id_att?>" <?=$selected?>><?=$descr_att?></option>
                                <?php
                                }
                                mysql_free_result($RsCourse);
                                ?>
                            </select>
                          </td>
                          <td>Categoria</td><td>
                            <select name="categ" style="font-size:12px; font-family:raleway; margin-top:10px; margin-bottom:15px;">
                                <?php 
                                $RsCourse = mysql_query("select id,descr from categoria order by descr", $connection);?>
                                <option value="">--</option>
                                <?php while ($row = mysql_fetch_array($RsCourse)){
                                $selected="";
                                $id_cat=$row['id'];
                                $descr_cat=$row['descr'];
                                if ($id_cat==$id_cat_sel) $selected=" SELECTED ";
                                ?>
                                <option value="<?=$id_cat?>" <?=$selected?>><?=$descr_cat?></option>
                                <?php
                                }
                                mysql_free_result($RsCourse);
                                ?>
                            </select>
                          </td>
                      </tr>
                      <tr>
                          <td colspan="4"><input name="submit" type="submit" value="Cerca"></td>
                          <input type="hidden" name="action" value="SubmitForm">
                      </tr>
                  </table>
                  </form>
              </div>  
<!--                <table id="myTable" class="display table table-striped table-hover table-bordered" cellspacing="10">-->
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Operatore</th>
                      <th>Lavorazione</th>
                      <th>Cliente</th>
                      <th>Attivit&agrave</th>
                      <th>Categoria</th>
                      <th>Quantit&agrave</th>
                      <th>Tempo Un.</th>
                      <th>Motivazione</th>
                      <th>Tempo Tot</th>
                      <th>Data</th>
                    </tr>
                  </thead>
<!--                  <tfoot>
                      <tr>
                      <th>Totale</th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th><?//=$cnt_rek;?></th>
                    </tr>
                  </tfoot>-->
                  <tbody>
        <!--Rest of table comes from table.php -->
                    <?php
                    $sql = "SELECT lavorazioni.id,login.username,tipo_lavorazione.descr,clienti.descr as cliente,attivita.descr as attivita,categoria.descr as categoria,lavorazioni.motivazione,(lavorazioni.tempo_new*lavorazioni.quantita) as tempo_tot,lavorazioni.quantita,lavorazioni.tempo_new,lavorazioni.data_ins FROM lavorazioni
                            inner join login on login.id=lavorazioni.id_operatore
                            inner join tipo_lavorazione on tipo_lavorazione.id=lavorazioni.id_tipo_lavorazione
                            inner join clienti on clienti.id=tipo_lavorazione.id_cliente
                            inner join attivita on attivita.id=tipo_lavorazione.id_attivita
                            inner join categoria on categoria.id=tipo_lavorazione.id_categoria
                            ".$cond."
                            order by lavorazioni.data_ins desc";
                    //echo $sql;
                    $myData = mysql_query($sql, $connection);
                    while($record = mysql_fetch_array($myData)){
                            echo"<tr>";
                            echo"<td>" . $record['id'] . "</td>";
                            echo"<td>" . $record['username'] . "</td>";
                            echo"<td>" . $record['descr'] . "</td>";
                            echo"<td>" . $record['cliente'] . "</td>";
                            echo"<td>" . $record['attivita'] . "</td>";
                            echo"<td>" . $record['categoria'] . "</td>";
                            echo"<td style='text-align:center'>" . $record['quantita'] . "</td>";
                            echo"<td style='text-align:center'>" . decimal_to_time($record['tempo_new']) . "</td>";
                            echo"<td>" . $record['motivazione'] . "</td>";
                            echo"<td style='text-align:center'>" . decimal_to_time($record['tempo_tot']) . "</td>";
                            echo"<td>" . $record['data_ins'] . "</td>";
                            echo"</tr>";        
                    }
                    $cnt_rek=mysql_num_rows($myData);
                    mysql_close($connection);
                    echo "Records: ".$cnt_rek;
                    ?>
                  </tbody>
              </table>
            </div>
        </div>
    </div>
</body>	


</html>