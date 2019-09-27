<?php

$cadenaSQL="
				SELECT 
				m_solicitudes_items.dosis_diaria,
				m_solicitudes_items.duracion_tratamiento,				
				m_solicitudes_items.estado,
				m_solicitudes_items.observacion_prescripcion,
				m_solicitudes_items.cronico,
				m_vademecum.descripcion,
				m_vademecum.precio,
				m_vademecum.presentacion,
				m_vademecum.forma_farmaceutica,
				m_unidades.descripcion AS m_unidades_descripcion
							
				FROM  m_solicitudes_items 
				LEFT JOIN m_vademecum ON 
				m_vademecum.id_m_vademecum=m_solicitudes_items.id_m_vademecum
				LEFT JOIN m_unidades ON
				m_unidades.id_m_unidad=m_solicitudes_items.id_m_unidad
				
				
				WHERE m_solicitudes_items.id_m_solicitud=" . $row["id_m_solicitud"] . " AND m_solicitudes_items.estado<>'DA'
				ORDER BY m_solicitudes_items.id_m_solicitud_item ASC
				";

//print $cadenaSQL;
$result_2 = $mysqli->query($cadenaSQL);
if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
$cantidad_registros_encontrados=$result_2->num_rows;

//print '<b>Prestaciones asignadas: '.$cantidad_registros_encontrados.'</b><br>';
print '
<table  class="table table-striped table-hover" cellpadding="2" cellspacing="2" border="0">
 <thead class="thead-default11">
  <tr bgcolor="#E5E5E5"> 
    <th>Monodroga</th>
	<th>Unidades (en letras)</th>	
	<th>Crónico</th>		  
    <th>Dosis (p/dia)</th>	  		
    <th>Cantidad de días</th>
    <th>Observación</th>		  			
    <th></th>
    </tr>
  </thead>
  ';
$es_protesis="no";
  while ($row_2 =$result_2->fetch_array()){
	 print '<tr>';
	 print '<td>'.$row_2["descripcion"].'/'.$row_2["presentacion"].$row_2["forma_farmaceutica"].'</td>';
	 print '<td>'.$row_2["m_unidades_descripcion"].'</td>';
	 print '<td> '; if ($row_2["cronico"]==1) print 'Sí'; else print 'No'; print '</td>';
	 print '<td> '.$row_2["dosis_diaria"].'</td>';	 
	 print '<td> '.$row_2["duracion_tratamiento"].'</td>';	 	 
	 print '<td> '.$row_2["observacion_prescripcion"].'</td>';	
	 //if($row_2["id_prestacion_tipo"]==3) $es_protesis="si";
  	print '</tr>';
  }
  print '</table>';

  ?>
