<?php

session_start();

require("Base.php");

class class_Solicitudes extends class_Base
{


  public function method_leer_solicitud($params, $error) {
	$p = $params[0];
	
	$estado = array();
	$estado["E"] = "Emitida";
	$estado["A"] = "Aprobada";
	$estado["B"] = "Bloqueada";
	$estado["C"] = "Capturada";
	$estado["L"] = "Liberada";
	$estado["F"] = "Prefacturada";
	$estado["P"] = "para Pago";
	
	
	$resultado = array();
	
	$sql = "SELECT solicitudes.id_solicitud, solicitudes.fecha_emite, solicitudes.estado, solicitudes.id_efector_publico, solicitudes.id_prestador_fantasia, _personas.persona_nombre, _personas.persona_dni FROM solicitudes INNER JOIN _personas USING(persona_id) WHERE TRUE";
	
	if (! is_null($p->desde) && ! is_null($p->hasta)) {
		$sql.= " AND (fecha_emite BETWEEN '" . substr($p->desde, 0, 10) . "' AND '" . substr($p->hasta, 0, 10) . "')";
	} else if (! is_null($p->desde)) {
		$sql.= " AND fecha_emite >= '" . substr($p->desde, 0, 10) . "'";
	} else if (! is_null($p->hasta)) {
		$sql.= " AND fecha_emite <= '" . substr($p->hasta, 0, 10) . "'";
	}
	
	if (! empty($p->id_prestador_fantasia)) $sql.= " AND id_prestador_fantasia='" . $p->id_prestador_fantasia . "'";
	if (! is_null($p->id_efector_publico)) $sql.= " AND id_efector_publico='" . $p->id_efector_publico . "'";
	if (! is_null($p->persona_id)) $sql.= " AND persona_id='" . $p->persona_id . "'";
	if (! is_null($p->id_usuario_medico)) $sql.= " AND id_usuario_medico='" . $p->id_usuario_medico . "'";
	if (! empty($p->estado)) $sql.= " AND estado='" . $p->estado . "'";
	
	$sql.= " ORDER BY fecha_emite DESC, id_solicitud DESC";
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$row->estado_descrip = $estado[$row->estado];
		
		if ($row->estado=="E") {
			$row->estado_condicion = 1;
		} else if ($row->estado=="A") {
			$row->estado_condicion = 2;
		} else if ($row->estado=="B") {
			$row->estado_condicion = 3;
		} else {
			$row->estado_condicion = 0;
		}
		
		$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->id_efector_publico . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->efector_publico = $rowAux->organismo_area;
		
		$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->id_prestador_fantasia . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->prestador = $rowAux->organismo_area;
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_solicitudes_prestaciones($params, $error) {
	$p = $params[0];
	
	$resultado = new stdClass;
	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
	
	$sql = "SELECT";
	$sql.= "  solicitudes_prestaciones.*";
	$sql.= ", prestaciones.*";
	$sql.= ", prestaciones_tipo.denominacion AS prestacion_tipo";
	$sql.= ", prestaciones_resultados.denominacion AS prestacion_resultado";
	$sql.= " FROM solicitudes_prestaciones INNER JOIN prestaciones USING(id_prestacion) INNER JOIN prestaciones_tipo USING(id_prestacion_tipo) LEFT JOIN prestaciones_resultados USING(id_prestacion_resultado)";
	$sql.= " WHERE solicitudes_prestaciones.id_solicitud=" . $p->id_solicitud;
	
	$resultado->prestacion = $this->toJson($sql, $opciones);
	
	
	
	$sql = "SELECT id_usuario_medico, informacion_clinica, observaciones, observaciones_bloqueo, anses_negativa FROM solicitudes WHERE id_solicitud=" . $p->id_solicitud;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	$row->anses_negativa = ($row->anses_negativa == "S") ? "Si" : "No";
	
	$sql = "SELECT apenom AS medico_descrip FROM _personal WHERE id_personal=" . $row->id_usuario_medico;
	$rsAux = $this->mysqli->query($sql);
	$rowAux = $rsAux->fetch_object();
	$row->medico_descrip = $rowAux->medico_descrip;
	
	$resultado->solicitud = $row;
	
	
	return $resultado;
  }
  
  
  public function method_escribir_solicitud($params, $error) {
	$p = $params[0];
	
	$set = $this->prepararCampos($p, "solicitudes");
	
	$this->mysqli->query("START TRANSACTION");
	  		
	$sql = "UPDATE solicitudes SET " . $set . " WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_bloquear_solicitud($params, $error) {
	$p = $params[0];
	
		
	$sql = "UPDATE solicitudes SET observaciones_bloqueo='" . $p->observaciones_bloqueo . "', estado_pre_bloqueo='" . $p->estado . "', fecha_bloqueo=NOW(), id_usuario_bloqueo='" . $_SESSION['login']->id_oas_usuario . "', estado='B' WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
  }
  
  
  public function method_desbloquear_solicitud($params, $error) {
	$p = $params[0];
	
	$sql = "UPDATE solicitudes SET observaciones_bloqueo='', estado=estado_pre_bloqueo WHERE id_solicitud=" . $p->id_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
  }
}































?>