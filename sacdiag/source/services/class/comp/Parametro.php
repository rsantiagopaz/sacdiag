<?php

require("Base.php");

class class_Parametro extends class_Base
{
  
  
  public function method_editar_parametro($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT id_" . $p->tabla . " FROM " . $p->tabla . " WHERE UPPER(descrip)='" . strtoupper($p->model->descrip) . "' AND id_" . $p->tabla . " <> " . $p->model->{"id_" . $p->tabla};
  	$rs = $this->mysqli->query($sql);
  	if ($rs->num_rows > 0) {
  		$error->SetError(0, "duplicado");
  		return $error;
  	} else {
  		$insert_id = $p->model->{"id_" . $p->tabla};
  		
  		if ($insert_id == "0") {
  			$sql = "INSERT " . $p->tabla . " SET descrip='" . $p->model->descrip . "'";
  			$this->mysqli->query($sql);
  			$insert_id = $this->mysqli->insert_id;
  		} else {
			$sql = "UPDATE " . $p->tabla . " SET descrip='" . $p->model->descrip . "' WHERE id_" . $p->tabla . "=" . $p->model->{"id_" . $p->tabla};
			$this->mysqli->query($sql);
  		}
  		
  		return $insert_id;
  	}
  }
  
  
  public function method_agregar_parametro($params, $error) {
  	$p = $params[0];
  	
  	$this->mysqli->query("START TRANSACTION");
  	
	$sql = "INSERT " . $p->tabla . " SET descrip=''";
	$this->mysqli->query($sql);
	$insert_id = $this->mysqli->insert_id;
	
	$sql = "UPDATE " . $p->tabla . " SET descrip='Nuevo (" . $insert_id . ")' WHERE id_" . $p->tabla . "=" . $insert_id;
	$this->mysqli->query($sql);
	
	$this->mysqli->query("COMMIT");
	
	return $insert_id;
  }
  
  
  public function method_leer_parametro($params, $error) {
  	$p = $params[0];

	$sql = "SELECT * FROM " . $p->tabla . " ORDER BY descrip";
	return $this->toJson($this->mysqli->query($sql));
  }
  
  
  public function method_autocompletarTipoReparacion($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT descrip AS label, id_tipo_reparacion AS model FROM tipo_reparacion WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($this->mysqli->query($sql));
  }
}

?>