<?php
session_start();

require("Base.php");

class class_TA_Parametros extends class_Base
{
  
  
  public function method_alta_modifica_prestacion($params, $error) {
  	$p = $params[0];
  	
  	$id_ta_prestacion = $p->model->id_ta_prestacion;
  	
	$sql = "SELECT id_ta_prestacion FROM ta_prestacion WHERE codigo LIKE '" . $p->model->codigo . "' AND id_ta_prestacion<>" . $id_ta_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_ta_prestacion, "codigo_duplicado");
		return $error;
	}
	
	$sql = "SELECT id_ta_prestacion FROM ta_prestacion WHERE descrip LIKE '" . $p->model->descrip . "' AND id_ta_prestacion<>" . $id_ta_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_ta_prestacion, "descrip_duplicado");
		return $error;
	}

		
	$set = $this->prepararCampos($p->model, "ta_prestacion");
		
	if ($id_ta_prestacion == "0") {
		$sql = "INSERT ta_prestacion SET " . $set;
		$this->mysqli->query($sql);
		
		$id_ta_prestacion = $this->mysqli->insert_id;
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	} else {
		$sql = "UPDATE ta_prestacion SET " . $set . " WHERE id_ta_prestacion=" . $id_ta_prestacion;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
	}
	
	return $id_ta_prestacion;
  }
	
	
  public function method_alta_modifica_prestacion_tipo($params, $error) {
  	$p = $params[0];
  	
  	$id_ta_tipo_prestacion = $p->model->id_ta_tipo_prestacion;
  	
	$sql = "SELECT id_ta_tipo_prestacion FROM ta_tipo_prestacion WHERE descrip LIKE '" . $p->model->descrip . "' AND id_ta_tipo_prestacion<>" . $id_ta_tipo_prestacion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_ta_tipo_prestacion, "duplicado");
		return $error;
	} else {
		$set = $this->prepararCampos($p->model, "ta_tipo_prestacion");
			
		if ($id_ta_tipo_prestacion == "0") {
			$sql = "INSERT ta_tipo_prestacion SET " . $set;
			$this->mysqli->query($sql);
			
			$id_ta_tipo_prestacion = $this->mysqli->insert_id;
			
			$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		} else {
			$sql = "UPDATE ta_tipo_prestacion SET " . $set . " WHERE id_ta_tipo_prestacion=" . $id_ta_tipo_prestacion;
			$this->mysqli->query($sql);
			
			$this->auditoria($sql, __FILE__ . ", " . __FUNCTION__);
		}
		
		return $id_ta_tipo_prestacion;
	}
  }
  
  
  public function method_leer_prestacion_tipo($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM ta_tipo_prestacion";

	return $this->toJson($sql);
  }

  
  
  public function method_autocompletarPrestacion($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->valor = "float";
  	
  	if (is_numeric($p->texto)) {
  		$sql = "SELECT ta_prestacion.*, id_ta_prestacion AS model, CONCAT(ta_prestacion.codigo, ', ', ta_prestacion.descrip, ' (', ta_tipo_prestacion.descrip, ')') AS label FROM ta_prestacion INNER JOIN ta_tipo_prestacion USING(id_ta_tipo_prestacion) WHERE ta_prestacion.codigo LIKE'%". $p->texto . "%'";
  	} else {
  		$sql = "SELECT ta_prestacion.*, id_ta_prestacion AS model, CONCAT(ta_prestacion.descrip, ', ', ta_prestacion.codigo, ' (', ta_tipo_prestacion.descrip, ')') AS label FROM ta_prestacion INNER JOIN ta_tipo_prestacion USING(id_ta_tipo_prestacion) WHERE ta_prestacion.descrip LIKE'%". $p->texto . "%'";
  		if (! is_null($p->phpParametros)) $sql.= " AND id_ta_tipo_prestacion=" . $p->phpParametros->id_ta_tipo_prestacion;  		
  	}
  	
  	$sql.= " ORDER BY label";


	return $this->toJson($sql, $opciones);
  }
 
  
  
  public function generateRandomString($length = 10) {
	return substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
  }
}

?>