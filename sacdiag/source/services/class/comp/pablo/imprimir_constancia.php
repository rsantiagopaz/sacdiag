<?php
require_once("config.php");
include("mainfile.php");
//include("head.html");
?>
	<link href="bootstrap.min.css" rel="stylesheet">
<?php

$id_solicitud=$_REQUEST["id_solicitud"];

				$cadenaSQL="SELECT
							_personas.persona_id,
							_personas.persona_dni,
							_personas.persona_nombre,
							_organismos_areas.organismo_area,
							m_solicitudes.id_m_solicitud,
							m_solicitudes.codigo,
							m_solicitudes.fecha_emite,
							m_solicitudes.estado,
							m_solicitudes.anses_negativa,							
							m_solicitudes.informacion_clinica,
							m_solicitudes.tratamiento_realizado,
							m_solicitudes.ini_reno_cambio,
							m_solicitudes.id_m_estadio,
							m_solicitudes.peso,
							m_solicitudes.talla,
							m_solicitudes.imc,
							m_solicitudes.superficie_corporal,
							m_solicitudes.fecha_inicio_enfermedad,								
							_personal.apenom as nombre_doctor,
							_personal.id_personal,
							oas_usuarios.SYSusuario
							
							FROM m_solicitudes
							LEFT JOIN _personas ON
							_personas.persona_id=m_solicitudes.persona_id			
							LEFT JOIN _organismos_areas ON
							_organismos_areas.organismo_area_id=m_solicitudes.id_efector_publico			
							LEFT JOIN _personal ON
							_personal.id_personal=m_solicitudes.id_usuario_medico
							LEFT JOIN oas_usuarios ON
							oas_usuarios.id_oas_usuario=m_solicitudes.id_usuario_emite														

							WHERE 1 
							AND m_solicitudes.id_m_solicitud=$id_solicitud";
				
				//print $cadenaSQL;
				
				$result = $mysqli->query($cadenaSQL);
				if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}

$row =$result->fetch_array();

?>
<table border="1" align="center" cellpadding="2" cellspacing="2" width="100%">
<tr>
<td>
<?php include("imprimir_constancia_form.php");?>
</td>
</tr>
</table>
<script language="JavaScript">window.print();</script>