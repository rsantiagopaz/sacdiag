<?php

session_start();

class class_Puco
{


  public function method_getPuco($params, $error) {
  	$p = $params[0];
  	
  	require("Conexion.php");
  	
	$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
	$mysqli->query("SET NAMES 'utf8'");
  	
  	$bandera = 0;
  	$puco = null;
  	
  	$sql = "SELECT * FROM salud1._personas_puco WHERE persona_id=" . $p->persona_id;
	$rs = $mysqli->query($sql);
	if ($rs->num_rows == 0) {
		$bandera = 1;
	} else {
		$puco = $rs->fetch_object();
		
		$fecha = new DateTime($puco->fecha);
		$fecha = $fecha->add(new DateInterval("P6M"));
		$fecha = $fecha->format("Y-m-d");
		
		$hoy = date("Y-m-d");
		
		if ($fecha < $hoy) $bandera = 2;
	}
	
	if ($bandera > 0) {
		$aux = $this->puco($p->persona_dni);
		
		if ($aux->resultado == "OK") {
			$puco = $aux;
			
			if ($bandera == 1) {
	  			$sql = "INSERT _personas_puco SET persona_id=" . $p->persona_id . ", fecha=NOW(), tipodoc='" . $puco->tipodoc . "', nrodoc='" . $puco->nrodoc . "', coberturaSocial='" . $puco->coberturaSocial . "', denominacion='" . $puco->denominacion . "', rnos='" . $puco->rnos . "'";
				$mysqli->query($sql);
			} else {
	  			$sql = "UPDATE _personas_puco SET fecha=NOW(), tipodoc='" . $puco->tipodoc . "', nrodoc='" . $puco->nrodoc . "', coberturaSocial='" . $puco->coberturaSocial . "', denominacion='" . $puco->denominacion . "', rnos='" . $puco->rnos . "' WHERE persona_id=" . $p->persona_id;
				$mysqli->query($sql);
			}
		}
	}
	
	return $puco;
  }
  
  
  
	public function puco($dni = false) {
	//SETEAR:
	//====================================================
	$usuario = "jmgranda"; $clave = "muyes3a2";
		
	/*********************************************************************************
		version 1.1
		
		DEVUELVE:
		====================================================
		$datos (objeto)
	
		Errores:
		$datos->resultado		errorDNI (Falta pasar DNI)
		$datos->resultado		errorSISA (Falla la conexion con SISA)
		$datos->resultado		errorOS (El DNI no posee cobertura social)
	
		Acierto:
		$datos->resultado		OK
	
		$datos->tipodoc			Tipo de documento del ciudadano, por ej: DNI
		$datos->nrodoc			Número de documento del ciudadano
		$datos->coberturaSocial	Nombre de la cobertura
		$datos->denominacion	Nombre del asegurado
		$datos->rnos			Código del Registro Nacional de Obras Sociales
	
	
		MODO DE USO
		====================================================
		- se debe pasar DNI
		
		$datos = puco($_REQUEST[dni]);
	
		if($datos->resultado == "OK"){
			echo $datos->coberturaSocial;
		}
		
	*********************************************************************************/
	
	
		//webService
		$url = 'https://sisa.msal.gov.ar/sisa/services/rest/puco/'.$dni;
	
		//autenticacion
		$data_array =  array(
			  "usuario"        => $usuario,
			  "clave"        => $clave
		);
		$data = json_encode($data_array);
	
	
		$curl = curl_init();
		/*******************************************OPCIONES*************************/
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data); //si requiere autenticación
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		  'APIKEY: 666',
		  'Content-Type: application/json',
		));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	
		/*******************************************EJECUCION************************/
		$result = curl_exec($curl);
	
		if(!$result){
			$datos = new stdClass();
			//control de DNI
			if(!$dni){
				$datos->resultado = "errorDNI";
				return $datos;
			}
			else{
				$datos->resultado = "errorSISA";
				return $datos;
			}
	
		}
		curl_close($curl);
	
		$datos=simplexml_load_string($result);
		if($datos->resultado != "OK"){
			$datos->resultado = "errorOS";
		}
		return $datos;
	}
}



//$datos = puco();
//print_r($datos);
?>

