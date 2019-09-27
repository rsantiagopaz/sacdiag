<?php
session_start();
require_once("config.php");



function ChequearUsuario($usuario, $password){

$usuario=strip_tags($usuario);
$password=strip_tags($password);

if (!empty($usuario) && !empty($password))
{
	//print $usuario.' -'.$password.'  ---';
	$Inyecciones =" AND INSERT DROP DELETE SELECT UPDATE TABLE HEX and insert drop delete select update table hex";
	$pos_usuario=strpos($Inyecciones,$usuario);
	$pos_password=strpos($Inyecciones,"delete");
	//print $pos_usuario.' -'.$pos_password;
	//die();
	if ($pos_usuario === true || $pos_password === true) {
		//die ($pos_usuario.' -'.$pos_password);
		print '<script language="JavaScript">location.href=("index.php");</script>';
		}
}
else Header("Location: index.php?error=Ingrese usuario");	

$usuario = mysql_real_escape_string($usuario);
$password = mysql_real_escape_string(md5($password));

require_once("config.php");

/*
$_usuario="root";
$_password="";
mysql_connect(localhost,$_usuario,$_password);
mysql_select_db(salud1);
*/

$cadena="
	SELECT 
	 _usuarios.SYSpassword, 
	 _usuarios.SYSusuario,
	 _personas.persona_nombre
	FROM _usuarios 
	LEFT JOIN _personas ON
	_personas.persona_id=_usuarios.id_persona
	WHERE _usuarios.SYSusuario='$usuario' AND _usuarios.SYSpassword='$password'";

$result = mysql_query($cadena);
if (mysql_errno()>0) {print mysql_errno()." ".mysql_error()." \n"; print $cadena; die();}

$cantidad=mysql_num_rows($result);

if($cantidad==1)
    {
	$row = mysql_fetch_array($result);
	$datos[0]=$row["SYSusuario"];
	$datos[1]=$row["persona_nombre"];	
	$datos[2]=$row["permisos"];
		
	session_start();
	session_register('datosUsuario');
	$_SESSION['datosUsuario']=$datos;
	//print 'usuario: '.$_SESSION['datosUsuario'][0].' nombre: '.$_SESSION['datosUsuario'][1];
	//die();

	Header("Location: a1_frame.php");
	}
else
	{
	//die($cadena);
	Header("Location: index.php?error=cantidad_usuarios-".$cantidad);
	}
	
}// de la funcion


function SesionUsuario(){
//session_start();
//session_register('datosUsuario');
$datos=$_SESSION['datosUsuario'];
return $datos;

}


///////////////////////////////////////////////////////////////////////////
function Resetear_usuario(){
//session_unregister('datosUsuario');
session_destroy();
//session_start();

/*

unset($_SESSION);
session_start();
*/
}


function UsuarioCambiarClave($usuario, $old_password, $new_password_1, $new_password_2){

$usuario = mysql_real_escape_string($usuario);
$old_password = mysql_real_escape_string(md5($old_password));

$cadena="SELECT * FROM _usuarios WHERE SYSusuario='$usuario' AND SYSpassword='$old_password'";
$result = mysql_query($cadena);
if (mysql_errno()>0) {print mysql_errno()." ".mysql_error().$cadena. die();}
$cantidad=mysql_numrows($result);
if($cantidad==1)
    {
	
	//veo si las nuevas claves no son vacías
	if($new_password_1=="" ||  $new_password_2=="") $_errores='Ingrese las nuevas claves<br>';
	//veo si las nuevas claves son iguales
	elseif($new_password_1==$new_password_2){
		$new_password_1 = mysql_real_escape_string(md5($new_password_1));
		$cadena="UPDATE salud1._usuarios SET SYSpassword='$new_password_1' WHERE SYSusuario='$usuario'";
		$result = mysql_query($cadena);
		print $cadena;
		if (mysql_errno()>0) {print mysql_errno()." ".mysql_error().$cadena. die();}
		//Header("Location: usuario_cambiar_clave.php?mensaje=Contraseña cambiada con éxito&usuario=$usuario");
		print '<script language="JavaScript">parent.location.href="usuario_cambiar_clave.php?op=despedida";</script>';
		
		$_errores='Contraseña cambiada con éxito usuario='.$usuario;
		}
	else
		//Header("Location: usuario_cambiar_clave.php?mensaje=Las contraseñas nuevas no coinciden&usuario=$usuario");
		$_errores='Las contraseñas nuevas no coinciden';
	}
else
	{
	//Header("Location: usuario_cambiar_clave.php?mensaje=La contraseña actual no es correcta&usuario=$usuario");
	$_errores='La contraseña actual no es correcta';
	}

	if (!empty($_errores)) {
			print '<script>';
			print 'parent.document.getElementById("errores").style.visibility="visible";';
			print 'parent.document.getElementById("errores").innerHTML="'.$_errores.'"';
			print '</script>';
			print $_errores;	
			die();
	}
	
}// de la funcion



function Fecha_en_Castellano($fecharequerida){

$diassemana=array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
$meses=array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
//$fecharequerida=date('Y-m-d H:i:s');
$fecharequerida=strtotime($fecharequerida);
$mostrar.= "".$diassemana[(date("w",$fecharequerida))]." ".date("j",$fecharequerida)." de ".$meses[(date("n",$fecharequerida))-1]." de ".date("Y",$fecharequerida);
return $mostrar;

}// de la función

//-------------------------------------------------------------------------------------

function Formatear_fecha($cadena_fecha,$con_hora){
		
		if($cadena_fecha=="0000-00-00 00:00:00") return ""; 	
		$originalDate = $cadena_fecha;
		$newDate = date("d-m-Y", strtotime($originalDate));
		$newDate_con_hora = date("d-m-Y H:i:s", strtotime($originalDate));

		if($con_hora==1) return $newDate_con_hora;
		else return  $newDate;	
}// de la función

//-----------------

function Parsear_Wester_Blott($cadena){
$vector=explode("-",$cadena);
$separador='<br>';
if($vector[0]==1) $display="6p 160".$separador;
if($vector[1]==1) $display.="6p 120".$separador;
if($vector[2]==1) $display.="p 65".$separador;
if($vector[3]==1) $display.="p 55".$separador;
if($vector[4]==1) $display.="p 51".$separador;
if($vector[5]==1) $display.="6p 41".$separador;
if($vector[6]==1) $display.="p 31".$separador;
if($vector[7]==1) $display.="p 24".$separador;
if($vector[8]==1) $display.="p 18".$separador;

print $display;
return;

}



function RangoEdad($edad_desde, $edad_hasta, $edad){

if ($edad_desde=="" && $edad_hasta=="") $cadena="dentro_de_rango";
//si manda EDAD DESDE
elseif($edad_desde!="" && $edad_hasta==""){
	if($edad_desde<=$edad)$cadena="dentro_de_rango";
	else $cadena="fuera_de_rango"; 
	}

//si manda EDAD HASTA
elseif($edad_desde=="" && $edad_hasta!=""){
	if($edad_hasta>=$edad)$cadena="dentro_de_rango";
	else $cadena="fuera_de_rango"; 
	}

//si manda EDAD HASTA
elseif($edad_desde!="" && $edad_hasta!=""){
	if(($edad_desde<=$edad) && ($edad<=$edad_hasta))$cadena="dentro_de_rango";
	else $cadena="fuera_de_rango"; 
	}
	


return $cadena;

}//de  la función


function Mostrar_Prestador($id_prestador, $domicilio){

include("config.php");
$cadenaSQL="SELECT
			prestadores_fantasia.nombre,
			prestadores_fantasia.domicilio,
			prestadores_fantasia.telefonos			
			FROM prestadores_fantasia
					
			WHERE prestadores_fantasia.organismo_area_id='$id_prestador'";

//print $cadenaSQL;

$result = $mysqli->query($cadenaSQL);
if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
$cantidad_registros_encontrados=$result->num_rows;
$row =$result->fetch_array();
if($cantidad_registros_encontrados==0)	print 'No se encontró prestador';
else {
	if($domicilio=="sin_domicilio")print $row["nombre"];
	else print $row["nombre"].'  - '.$row["domicilio"].'<br> tel: '.$row["telefonos"];
	}
}// de la funcion

//-------------------------GENERAR CLAVE
function GenerarCodigo($id_solicitud)
{

       $_longitud=9-strlen($id_solicitud);
       $_key="ABCDEFGHIJKLMNOPQRSTUWXYZ";
       $_key.="1234567890";
	   $_id="";
       for ($_index=0; $_index<$_longitud;$_index++)
        {   $_id.=substr($_key,(rand() % (strlen($_key))), 1); }
    
	  return $clave_generada = $_id.$id_solicitud;

}



function Elegir_Prestador($id_prestador){
include("config.php");

//---------SI NO ES VACIO EL ID_PRESTADOR LO MUESTRO (CUANDO ESTÁN EDITANDO LA SOLICITUD)
if($id_prestador!="")
{
$cadenaSQL="SELECT
			_organismos_areas.organismo_area_id,
			_organismos_areas.organismo_area,
			_organismos_areas.organismo_area_descripcion			
			FROM _organismos_areas
			WHERE _organismos_areas.organismo_area_id='$id_prestador'";

		$result = $mysqli->query($cadenaSQL);
		if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
		$cantidad_registros_encontrados=$result->num_rows;
		$row =$result->fetch_array();
		if($cantidad_registros_encontrados==0)	print 'No se encontró prestador';
		else {
		session_start();
		$_SESSION['datosPrestador'][0]=$row["organismo_area_id"];
		$_SESSION['datosPrestador'][1]=$row["organismo_area"];
		print '<script>document.getElementById("Nombre_Prestador").innerHTML="'.$_SESSION['datosPrestador'][1].'";</script>';
		print '<script>document.getElementById("id_prestador").value="'.$_SESSION['datosPrestador'][0].'";</script>';
		

		}
}
//---------------SI VIENE VACIO EL ID_PRESTADOR GENERO EL PRESTADOR
else
{
$cadenaSQL="SELECT
			_organismos_areas.organismo_area_id,
			_organismos_areas.organismo_area,
			solicitudes.estado,
            COUNT(id_prestador) AS CANTIDAD_PRESTACIONES
			
			FROM solicitudes
			LEFT JOIN _organismos_areas ON
			_organismos_areas.organismo_area_id=solicitudes.id_prestador
			WHERE id_prestador<>''
            GROUP BY id_prestador
            ORDER BY CANTIDAD_PRESTACIONES ASC
			";
		$result = $mysqli->query($cadenaSQL);
		if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
		$row =$result->fetch_array();
		session_start();
		$_SESSION['datosPrestador'][0]=$row["organismo_area_id"];
		$_SESSION['datosPrestador'][1]=$row["organismo_area"];		
		/*		
		print '<script>document.getElementById("Nombre_Prestador").innerHTML="'.$row["organismo_area"].'";</script>';
		print '<script>document.getElementById("id_prestador").value="'.$row["organismo_area_id"].'";</script>';
		*/
		
		print '<script>document.getElementById("Nombre_Prestador").innerHTML="'.$_SESSION['datosPrestador'][1].'";</script>';
		print '<script>document.getElementById("id_prestador").value="'.$_SESSION['datosPrestador'][0].'";</script>';
		
}

return;
}// de la funcion



function Asignar_Prestador_ANTERIOR(){

include("config.php");
$cadenaSQL="SELECT * FROM ranking_prestadores";
		$result = $mysqli->query($cadenaSQL);
		if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
		
		$encontre_prestador="NO";
		while ($row =$result->fetch_array()){
			$id_prestador=$row["organismo_area_id"];
					//-------------- RECORRO EL VECTOR DE PRACTICAS ELEGIDAS Y CHEQUEO SI ESTÁN HABILITADAS PARA EL PRESTADOR 
				$hay_prestaciones="SI";	
				  foreach ($_SESSION['prestaciones_elegidas'] as $id_prestacion=>$prestacion_nombre){ 
					  
								$cadenaSQL="SELECT * FROM  prestadores_prestaciones WHERE id_prestacion=$id_prestacion AND id_prestador='$id_prestador' AND estado='H'";
								$result_2 = $mysqli->query($cadenaSQL);
								if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.$cadenaSQL;die();}
								print $cadenaSQL.'<br>';
								//SI LA PRESTACION NO ESTÁ HABILITADA HAGO UN BREAK Y PASO AL SIGUIENTE PRESTADOR
								if($result_2->num_rows<=0) 	 {$hay_prestaciones="NO";break;}						
								
		
				}//ciclo del vector de practicas elegidas
				
				if($hay_prestaciones=="SI"){
								$vector_mensaje[0]="hay_prestador";
								$vector_mensaje[1]=$id_prestador;
								$encontre_prestador="SI";
								break;
								}
				
		}//ciclo de ranking de prestadores

print 'vector[0]: '.$vector_mensaje[0].' vector[1]: '.$vector_mensaje[1];
if($encontre_prestador=="SI") return $vector_mensaje;
else
	{ 
	  $vector_mensaje[0]="no_hay_prestador";
	  return $vector_mensaje;
	}
				
}//de la funcion

function SQL(){

//RANKING DE PRESTADORES
$cadena="SELECT
			_organismos_areas.organismo_area_id,
			_organismos_areas.organismo_area,
            COUNT(solicitudes.id_prestador) AS CANTIDAD_PRESTACIONES
			
			FROM _organismos_areas
			LEFT JOIN  solicitudes ON 
			_organismos_areas.organismo_area_id=solicitudes.id_prestador
			WHERE _organismos_areas.organismo_id='PP'
            GROUP BY solicitudes.id_prestador
            ORDER BY CANTIDAD_PRESTACIONES ASC
			";
			
/*			
create view ranking_prestadores AS
SELECT
			_organismos_areas.organismo_area_id COLLATE latin1_swedish_ci AS organismo_area_id,
			_organismos_areas.organismo_area COLLATE latin1_swedish_ci AS organismo_area,
            COUNT(solicitudes.id_prestador) AS CANTIDAD_PRESTACIONES
			
			FROM _organismos_areas
			LEFT JOIN  solicitudes ON 
			_organismos_areas.organismo_area_id=CONVERT(solicitudes.id_prestador USING latin1)
			WHERE _organismos_areas.organismo_id='PP' 
            GROUP BY solicitudes.id_prestador
            ORDER BY CANTIDAD_PRESTACIONES ASC			
*/			
}

function Auditoria($id_usuario, $fecha, $sql_ejecutado, $ip, $seccion){

include("config.php");

//$sql_ejecutado = addslashes($sql_ejecutado);
//$sql_ejecutado = str_replace("'","\\'", $sql_ejecutado);
//$sql_ejecutado = str_replace('\"','\\"', $sql_ejecutado);

$sql_ejecutado = $mysqli->real_escape_string($sql_ejecutado);

if(!empty($_SERVER['HTTP_CLIENT_IP'])){
        $ip=$_SERVER['HTTP_CLIENT_IP'];
      }
      elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
        $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
      }
      else{
        $ip=$_SERVER['REMOTE_ADDR'];
      }


						$cadenaSQL = "INSERT INTO auditoria (
							id_usuario,
							fecha,
							sql_ejecutado,
							ip,
							seccion
						)
						VALUES(
							'$id_usuario',
							'$fecha',
							'$sql_ejecutado',
							'$ip',
							'$seccion'
						)";
						
						$result = $mysqli->query($cadenaSQL);
						if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.$cadenaSQL;die();}

}//de la funcion

function Mostrar_Estado($estado){

if($estado=="AS"){ 
	$estado_imprimir="APROBADA por Serv.Soc.Ministerio";
	print '<h4><span class="badge badge-secondary">'.$estado_imprimir.'</span></h4>';  
	}
if($estado=="DS" || $estado=="DA" || $estado=="DF") {
	if($estado=="DS") $estado_imprimir="DENEGADA Serv.Soc.";
	if($estado=="DA") $estado_imprimir="DENEGADA Auditoria Médica";
	if($estado=="DF") $estado_imprimir="DENEGADA por Farmacia";		
	print '<h4><span class="label label-danger">'.$estado_imprimir.'</span></h4>';  
	}
if($estado=="AA") {
	$estado_imprimir="AUTORIZADA Aud. Med.";
	print '<h4><span class="label label-success">'.$estado_imprimir.'</span><h4>';  
	}
if($estado=="EF") {
	$estado_imprimir="ENTREGADA por farmacia";
	print '<h4><span class="badge badge-dark">'.$estado_imprimir.'</span><h4>';  
	}	

if($estado=="EH") {
	$estado_imprimir="EMITIDA por hospital";
	print '<h4><span class="label label-primary">'.$estado_imprimir.'</span></h4>';  
	}

}

//--------------------
function Imprimir_Prestador_Elegido($id_prestador, $formateado){
include("config.php");
$cadenaSQL="SELECT * 	FROM prestadores_fantasia 	WHERE prestadores_fantasia.organismo_area_id='$id_prestador'";
$result = $mysqli->query($cadenaSQL);
if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
$row =$result->fetch_array();
if ($formateado=="formateado")$cadena='<div  class="alert alert-success">Prestador seleccionado: <b>'.$row["nombre"].'</b></div>'; 
else $cadena=$row["nombre"]; 

return $cadena;
}


//--------------------
function Mostrar_Unidad($id_unidad){
include("config.php");
$cadenaSQL="SELECT * 	FROM m_unidades 	WHERE id_m_unidad=$id_unidad";
$result = $mysqli->query($cadenaSQL);
if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
$row =$result->fetch_array();
return $row["descripcion"];
}

//--------------------
function Mostrar_Ini_Reno_Cambio($id){
if($id==1) print 'INICIO';
elseif($id==2) print 'RENOVACION';
elseif($id==3) print 'CAMBIO';

return;
}

//--------------------
function Mostrar_Estadio($id_estadio){
include("config.php");
$cadenaSQL="SELECT * 	FROM m_estadios 	WHERE id_m_estadio=$id_estadio";
$result = $mysqli->query($cadenaSQL);
if ($mysqli->errno) {print '<br>Connect Error: ' . $mysqli->errno.'<br>'.$mysqli->error.'<br>'.$cadenaSQL;die();}
$row =$result->fetch_array();
return $row["descripcion"];
}



?>