<?php

session_start();

require("Base.php");

class class_Solicitudes extends class_Base
{


  public function method_alta_modifica_solicitud($params, $error) {
	$p = $params[0];
	
	$p->ta_solicitud->id_usuario_emite = $_SESSION['login']->usuario;
	
	$set = $this->prepararCampos($p->ta_solicitud, "ta_solicitud");

	$sql = "INSERT ta_solicitud SET " . $set . ", f_emite=NOW(), id_oas_usuario_emite=" . $_SESSION['login']->id_oas_usuario . ", estado='E'";
	$this->mysqli->query($sql);
	
	$id_ta_solicitud = $this->mysqli->insert_id;
	
	foreach ($p->ta_solicitud_item as $ta_solicitud_item) {
		$ta_solicitud_item->id_ta_solicitud = $id_ta_solicitud;
		
		
		$set = $this->prepararCampos($ta_solicitud_item, "ta_solicitud_item");

		$sql = "INSERT ta_solicitud_item SET " . $set;
		$this->mysqli->query($sql);
	}
  }
  
  
  public function method_leer_solicitud($params, $error) {
	$p = $params[0];
	
	$resultado = new stdClass;
	
	$sql = "SELECT * FROM ta_solicitud WHERE id_ta_solicitud=" . $p->id_ta_solicitud;
	$resultado->solicitud = $this->toJson($sql);
	$resultado->solicitud = $resultado->solicitud[0];
	
	$sql = "SELECT persona_id AS model, CONCAT(TRIM(persona_nombre), ' (', persona_dni, ')') AS label, persona_tipodoc, persona_dni FROM _personas WHERE persona_id=" . $resultado->solicitud->persona_id_paciente;
	$resultado->cboPaciente = $this->toJson($sql);
	$resultado->cboPaciente = $resultado->cboPaciente[0];
	
	$sql = "SELECT id_personal AS model, TRIM(apenom) AS label FROM _personal WHERE id_personal=" . $resultado->solicitud->id_personal_medico;
	$resultado->cboPersonal = $this->toJson($sql);
	$resultado->cboPersonal = $resultado->cboPersonal[0];
	
	$sql = "SELECT id_diagnostico AS model, CONCAT(descripcion4, ' (', cod_4, ')') AS label FROM cie10 WHERE id_diagnostico=" . $resultado->solicitud->id_diagnostico;
	$resultado->cboDiagnostico = $this->toJson($sql);
	$resultado->cboDiagnostico = $resultado->cboDiagnostico[0];
	


  	$opciones = new stdClass;
  	$opciones->cant_acompanantes = "int";
  	$opciones->cant_dias = "int";
  	$opciones->monto_presup = "float";
  	
	$sql = "SELECT ta_solicitud_item.*, CONCAT(ta_prestacion.descrip, ' - ', ta_prestacion.codigo, ' (', ta_tipo_prestacion.descrip, ')') AS prestacion, ta_establecimiento.descrip AS establecimiento FROM ta_solicitud_item INNER JOIN ta_prestacion USING(id_ta_prestacion) INNER JOIN ta_tipo_prestacion USING(id_ta_tipo_prestacion) INNER JOIN ta_establecimiento USING(id_ta_establecimiento) WHERE ta_solicitud_item.id_ta_solicitud=" . $resultado->solicitud->id_ta_solicitud;
	$resultado->items = $this->toJson($sql, $opciones);
	
	
	
	return $resultado;
  }
  
  
  public function method_leer_solicitudes($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT ta_solicitud.id_ta_solicitud, ta_solicitud.f_emite, _personas.persona_nombre AS paciente, _personas.persona_dni AS dni FROM ta_solicitud INNER JOIN _personas ON ta_solicitud.persona_id_paciente=_personas.persona_id";
	
	return $this->toJson($sql);
  }
}































?>