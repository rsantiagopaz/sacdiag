<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet' type='text/css'>
<style type="text/css">
<!--
td {
	margin-left: 10px;
	margin-top: 10px;
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 14px;
}

.cabezera{
	ffont-family: 'Roboto Condensed', sans-serif;
	font-size: 12px;
	color: #999999;

}
</style>

<table   width="650" align="center" cellpadding="4" cellspacing="4">
  <tr> 
    <td width="272"><b><img src="logo_salud.jpg" width="233" height="69"></b></td>
    <td width="283"> <div class="cabezera"> 
        <?php 
	//print '<b>Usuario:</b> '.$_SESSION['datosUsuario'][0].' ('.$_SESSION['datosUsuario'][1].') ';
	print '<b>Usuario:</b> '.$row["SYSusuario"];	
	print '<br><b>	Fecha de impresión:</b>'. date("Y-m-d H:i:s").'<br> id: '.$id_solicitud;?>
      </div></td>
  </tr>
  <tr> 
    <td colspan="2"><div align="center">  <br>
        <div id="titulo_constancia"> </div>
      </div>
      <hr></td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"><strong>Apellido y Nombre:&nbsp;&nbsp; 
        </strong></div></td>
    <td> &nbsp; 
      <?php print $row["persona_nombre"];?>
    </td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"><strong>DNI:</strong></div></td>
    <td> &nbsp; 
      <?php print $row["persona_dni"];?>
    </td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"><strong>Efector:</strong></div></td>
    <td> &nbsp; 
      <?php print $row["organismo_area"];?>
    </td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"><strong>Fecha emisión:</strong></div></td>
    <td> &nbsp; 
      <?php print Formatear_fecha($row["fecha_emite"],0);?>
    </td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"><strong>Médico Solicitante:</strong></div></td>
    <td> &nbsp; 
      <?php print $row["nombre_doctor"];?>
    </td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"><strong>Certificación negativa de ANSES: 
        </strong></div></td>
    <td valign="top">&nbsp; 
      <?php 
	  		if($row["anses_negativa"]=="S") print 'SI'; 
	  		elseif($row["anses_negativa"]=="N") {
					
					print '<div style="float:left">NO</div>';
					print '<div class="cabezera" style="float:left"><em> - La práctica será revisada por Auditoría Médica (Min. Salud)</em></div>';
					}
	  ?>
    </td>
  </tr>
  <tr> 
    <td valign="top"><div align="right"><b> 
        <?php print Mostrar_Ini_Reno_Cambio($row["ini_reno_cambio"]);?></b> 
        </strong></div></td>
    <td valign="top"> &nbsp;de TRATAMIENTO </td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"><strong>Información Clínica</strong>:</div></td>
    <td valign="top"> &nbsp; 
      <?php  print $row["informacion_clinica"]; ?>
    </td>
  </tr>
  <tr> 
    <td valign="top"><div align="right"><strong>Tratamiento realizado:</strong>:</div></td>
    <td valign="top">&nbsp; 
      <?php  print $row["tratamiento_realizado"];?>
    </td>
  </tr>
  <tr> 
    <td valign="top"><div align="right"><strong>TNM/RADIO:</strong></div></td>
    <td valign="top"> &nbsp; 
      <?php print Mostrar_Estadio($row["id_m_estadio"]);?>
    </td>
  </tr>
  <tr> 
    <td valign="top"><div align="right"><strong>PESO:</strong></div></td>
    <td valign="top">&nbsp; 
      <?php   print $row["peso"].' - TALLA: '.$row["talla"].' - IMC: '.$row["imc"].' - SUP. CORPORAL: '.$row["superficie_corporal"] ; ?>m2
    </td>
  </tr>
  <tr> 
    <td valign="top"> <div align="right"></div></td>
    <td valign="top">&nbsp; </td>
  </tr>
  <tr> 
    <td colspan="2"> <?php include("solicitudes_include_prestaciones_elegidas.php");?> </td>
  </tr>
  <tr> 
    <td colspan="2" align="center" valign="top"> <hr></td>
  </tr>
  <tr> 
    <td colspan="3" align="center" valign="top"> <br> <table width="100%">
        <tr> 
          <td>............................<br>
            Firma Operador </td>
          <td>............................<br>
            Firma Médico</td>
          <td>............................<br>
            Firma Jefe de Servicio </td>
          <td> 
            <?php print '<img src="generador_codigo_qr.php?cadena='.$row["codigo"].'" />';
	  print '<div class="cabezera1">'.$row["codigo"].'</div>';
	  ?>
          </td>
        </tr>
      </table>
      &nbsp;</td>
  </tr>
  <?php
if(false) 
{
print '<script language="JavaScript">
document.getElementById("titulo_constancia").innerHTML="CONSTANCIA DE SOLICITUD DE PROTESIS";
</script>';

print '
<tr> 
<td align="center" valign="top"> <br><br><br>
<br>
............................<br>Médico Solicitante 
</td>
<td align="center" valign="top"> <br><br><br>
<br>
............................<br>Jefe de Servicios
</td>
<td align="center" valign="top"> <br><br><br>
<br>
............................<br>Director de Hospital
</td>

<tr>';
}
else 
print '<script language="JavaScript">
document.getElementById("titulo_constancia").innerHTML="CONSTANCIA DE SOLICITUD DE MEDICAMENTOS";
</script>';

?>
  <tr> 
    <td colspan="3"> <br> <br> <br> <div class="cabezera"><em>En caso que correspondiera, se deberá adjuntar la copia de los estudios realizados y/o Resumen de HC. La presente constancia 
        tendrá una validez de 30 días a partir de su emisión</em></div></td>
  </tr>
</table>
