<?php

session_start();

require("Base.php");

class class_Prefacturacion extends class_Base
{
	
	
  public function method_leer_solicitudes($params, $error) {
	$p = $params[0];
	
	$resultado = array();
	
	$sql = "SELECT solicitudes.*, _personas.persona_nombre, _personas.persona_dni, prefacturaciones_items.id_prefacturacion_item, prefacturaciones_items.observaciones, prefacturaciones_items.estado AS prefacturaciones_items_estado FROM prefacturaciones_items INNER JOIN solicitudes USING(id_solicitud) INNER JOIN _personas USING(persona_id)";
	$sql.= " WHERE prefacturaciones_items.id_prefacturacion=" . $p->id_prefacturacion;
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->id_efector_publico . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->efector_publico = $rowAux->organismo_area;
		
		$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->id_prestador . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->prestador = $rowAux->organismo_area;
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }


  public function method_leer_prefacturacion($params, $error) {
	$p = $params[0];
	
	$resultado = array();
	
	$sql = "SELECT prefacturaciones.*, prestadores.nombre FROM prefacturaciones INNER JOIN prestadores USING(id_prestador) WHERE prefacturaciones.estado <> 'P' ORDER BY prefacturaciones.fecha_creacion DESC";
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$sql = "SELECT id_prefacturacion_item FROM prefacturaciones_items INNER JOIN solicitudes USING(id_solicitud) WHERE prefacturaciones_items.id_prefacturacion='" . $row->id_prefacturacion . "'";
		$rsAux = $this->mysqli->query($sql);
		
		$row->cantidad = $rsAux->num_rows;
		

		$sql = "SELECT prefacturaciones_items.id_prefacturacion, SUM(solicitudes_prestaciones.importe) AS total FROM prefacturaciones_items INNER JOIN solicitudes_prestaciones USING(id_solicitud) WHERE prefacturaciones_items.estado='F' AND prefacturaciones_items.id_prefacturacion='" . $row->id_prefacturacion . "' GROUP BY id_prefacturacion";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		
		$row->valor = (float) $rowAux->total;
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_solicitudes_prestaciones($params, $error) {
	$p = $params[0];
	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
	
	$sql = "SELECT";
	$sql.= "  solicitudes_prestaciones.*";
	$sql.= ", prestaciones.*";
	$sql.= ", prestaciones_tipo.denominacion AS prestacion_tipo";
	$sql.= ", prestaciones_resultados.denominacion AS prestacion_resultado";
	$sql.= " FROM solicitudes_prestaciones INNER JOIN prestaciones USING(id_prestacion) INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) LEFT JOIN prestaciones_resultados USING(id_prestacion_resultado)";
	$sql.= " WHERE solicitudes_prestaciones.id_solicitud=" . $p->id_solicitud;
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_observar($params, $error) {
	$p = $params[0];
	
	$resultado = new stdClass;
	$resultado->estado = "E";
	
	$sql = "UPDATE prefacturaciones_items SET observaciones='" . $p->observaciones . "', estado='" . $p->prefacturaciones_items_estado . "' WHERE id_prefacturacion_item=" . $p->id_prefacturacion_item;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	
	/*
	$sql = "SELECT estado FROM prefacturaciones_items WHERE id_prefacturacion=" . $p->id_prefacturacion;
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		if ($row->estado == "O") {
			$resultado->estado = "O";
			break;
		}
	}
	
	$sql = "UPDATE prefacturaciones SET estado='" . $resultado->estado . "' WHERE id_prefacturacion=" . $p->id_prefacturacion;
	$this->mysqli->query($sql);
	*/
	
	return $resultado;
  }
  
  
  public function method_escribir_prefacturacion($params, $error) {
	$p = $params[0];
	
	$this->mysqli->query("START TRANSACTION");
	
	$set = $this->prepararCampos($p, "prefacturaciones");
	  		
	$sql = "UPDATE prefacturaciones SET " . $set . " WHERE id_prefacturacion=" . $p->id_prefacturacion;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);

	
	$sql = "SELECT id_solicitud FROM prefacturaciones_items WHERE id_prefacturacion=" . $p->id_prefacturacion;
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$sql = "UPDATE solicitudes SET fecha_ap_fac=NOW(), id_usuario_ap_fac='" . $_SESSION['login']->usuario . "', estado='P' WHERE id_solicitud=" . $row->id_solicitud;
		$this->mysqli->query($sql);
	}
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_validar_asunto($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT documentacion_id FROM salud1.001_documentaciones WHERE documentacion_id='" . $p->documentacion_id . "'";
	$rs = $this->mysqli->query($sql);
	$bool1 = ($rs->num_rows == 0);
	$sql = "SELECT organismo_area_de_id, organismo_area_para_id FROM salud1.001_documentaciones_seguimientos WHERE documentacion_id='" . $p->documentacion_id . "' ORDER BY seguimiento_id_orden DESC LIMIT 1";
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$bool2 = ($row->organismo_area_de_id != $p->organismo_area_id || trim($row->organismo_area_para_id) != "");
	if ($bool1 || $bool2) {
		return false;
	} else {
		return true;
	}
  }
}

?>