<?php

session_start();

require("Base.php");

class class_TA_Solicitudes extends class_Base
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
	
	$sql = "SELECT ta_solicitud.*, _personas.persona_nombre, _personas.persona_dni, cie10.descripcion4 AS diagnostico FROM ta_solicitud INNER JOIN _personas ON ta_solicitud.persona_id_paciente = _personas.persona_id INNER JOIN cie10 USING(id_diagnostico) WHERE TRUE";
	
	if (! is_null($p->desde) && ! is_null($p->hasta)) {
		$sql.= " AND (f_emite BETWEEN '" . substr($p->desde, 0, 10) . "' AND '" . substr($p->hasta, 0, 10) . "')";
	} else if (! is_null($p->desde)) {
		$sql.= " AND f_emite >= '" . substr($p->desde, 0, 10) . "'";
	} else if (! is_null($p->hasta)) {
		$sql.= " AND f_emite <= '" . substr($p->hasta, 0, 10) . "'";
	}
	
	if (! is_null($p->persona_id_paciente)) $sql.= " AND persona_id_paciente='" . $p->persona_id_paciente . "'";
	if (! is_null($p->id_efector_publico)) $sql.= " AND organismo_area_id_efector_publico='" . $p->id_efector_publico . "'";
	if (! is_null($p->id_personal_medico)) $sql.= " AND id_personal_medico='" . $p->id_personal_medico . "'";
	if (! empty($p->estado)) $sql.= " AND estado='" . $p->estado . "'";
	
	$sql.= " ORDER BY f_emite DESC";
	
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
		
		$sql = "SELECT organismo_area FROM _organismos_areas WHERE organismo_area_id='" . $row->organismo_area_id_efector_publico . "'";
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->efector_publico = $rowAux->organismo_area;
		
		$sql = "SELECT apenom AS medico_descrip FROM _personal WHERE id_personal=" . $row->id_personal_medico;
		$rsAux = $this->mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$row->medico_descrip = $rowAux->medico_descrip;
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_leer_solicitudes_prestaciones($params, $error) {
	$p = $params[0];
	
  	$opciones = new stdClass;
  	$opciones->cant_acompanantes = "int";
  	$opciones->cant_dias = "int";
  	$opciones->monto_presup = "float";
	
	
	$sql = "SELECT";
	$sql.= "  ta_solicitud_item.*";
	$sql.= ", ta_establecimiento.descrip AS ta_establecimiento_descrip";
	$sql.= ", ta_prestacion.*";
	$sql.= ", ta_tipo_prestacion.descrip AS ta_tipo_prestacion_descrip";
	$sql.= " FROM ta_solicitud_item INNER JOIN ta_establecimiento USING(id_ta_establecimiento) INNER JOIN ta_prestacion USING(id_ta_prestacion) INNER JOIN ta_tipo_prestacion USING(id_ta_tipo_prestacion)";
	$sql.= " WHERE ta_solicitud_item.id_ta_solicitud=" . $p->id_ta_solicitud;
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_escribir_solicitud($params, $error) {
	$p = $params[0];
	
	$set = $this->prepararCampos($p, "ta_solicitud");
	
	$this->mysqli->query("START TRANSACTION");
	  		
	$sql = "UPDATE ta_solicitud SET " . $set . " WHERE id_ta_solicitud=" . $p->id_ta_solicitud;
	$this->mysqli->query($sql);
	
	$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	
	$this->mysqli->query("COMMIT");
  }
}































?>