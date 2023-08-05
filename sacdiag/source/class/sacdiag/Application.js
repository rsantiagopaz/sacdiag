/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "sacdiag"
 *
 * @asset(sacdiag/*)
 */
qx.Class.define("sacdiag.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */




      
      // Document is the application root
	var doc = this.getRoot();
	
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	

	
	var id_version = 2;
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.ControlAcceso");
	try {
		var resultado = rpc.callSync("leer_version");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	if (id_version == resultado.id_version) {
		qx.event.Timer.once(function(){
			var win = new sacdiag.comp.windowLogin();
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
		
				this.login = data;
				
				qx.event.Timer.once(function(){
					this.initApp();
				}, this, 20);
			}, this);
			
			doc.add(win);
			win.center();
			win.open();
		}, this, 20);
		
	} else {
		alert("Presione F5 para actualizar aplicación. Si el problema persiste comunicarse con servicio técnico.");
		
		location.reload(true);
	}
	
	
	
	
	
    },
    
	initApp : function ()
	{
		
      // Document is the application root
	var doc = this.getRoot();
	
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	
	
	
	

	
	var pageMain = {};

	var loading = this.loading = new componente.comp.ui.ramon.image.Loading("sacdiag/loading66.gif");
	
	sacdiag.comp.rpc.Rpc.LOADING = loading;
	
	
	var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
	numberformatMontoEs.setGroupingUsed(true);
	numberformatMontoEs.setMaximumFractionDigits(2);
	numberformatMontoEs.setMinimumFractionDigits(2);
	
	var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
	numberformatMontoEn.setGroupingUsed(false);
	numberformatMontoEn.setMaximumFractionDigits(2);
	numberformatMontoEn.setMinimumFractionDigits(2);
	
	var numberformatEntero = this.numberformatEntero = new qx.util.format.NumberFormat("en");
	numberformatEntero.setGroupingUsed(false);
	numberformatEntero.setMaximumFractionDigits(0);
	numberformatEntero.setMinimumFractionDigits(0);
	
	

	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this.tabviewMain = new qx.ui.tabview.TabView();
	doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	//contenedorMain.add(tabviewMain);
	
	
	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		var win = new sacdiag.comp.windowAcercaDe();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	var mnuEdicion = new qx.ui.menu.Menu();
	
	
	
	var btnPanelDeEstudiosEnProceso = new qx.ui.menu.Button("Panel de Estudios en Proceso...");
	btnPanelDeEstudiosEnProceso.addListener("execute", function(){
		if (pageMain["pagePanelDeEstudiosEnProceso"] == null) {
			pageMain["pagePanelDeEstudiosEnProceso"] = new sacdiag.comp.pagePanelDeEstudiosEnProceso();
			pageMain["pagePanelDeEstudiosEnProceso"].addListenerOnce("close", function(e){
				pageMain["pagePanelDeEstudiosEnProceso"] = null;
			});
			tabviewMain.add(pageMain["pagePanelDeEstudiosEnProceso"]);
		}
		tabviewMain.setSelection([pageMain["pagePanelDeEstudiosEnProceso"]]);
	});
	mnuEdicion.add(btnPanelDeEstudiosEnProceso);
	
	
	var btnPanelDePLH = new qx.ui.menu.Button("Panel de Pañal y Leche...");
	btnPanelDePLH.addListener("execute", function(){
		if (pageMain["pagePanelDePLH"] == null) {
			pageMain["pagePanelDePLH"] = new sacdiag.comp.pagePanelDePLH();
			pageMain["pagePanelDePLH"].addListenerOnce("close", function(e){
				pageMain["pagePanelDePLH"] = null;
			});
			tabviewMain.add(pageMain["pagePanelDePLH"]);
		}
		tabviewMain.setSelection([pageMain["pagePanelDePLH"]]);
	});
	mnuEdicion.add(btnPanelDePLH);
	
	
	var btnControlDePrefacturaciones = new qx.ui.menu.Button("Control de Prefacturaciones...");
	btnControlDePrefacturaciones.addListener("execute", function(){
		if (pageMain["pageControlDePrefacturaciones"] == null) {
			pageMain["pageControlDePrefacturaciones"] = new sacdiag.comp.pageControlDePrefacturaciones();
			pageMain["pageControlDePrefacturaciones"].addListenerOnce("close", function(e){
				pageMain["pageControlDePrefacturaciones"] = null;
			});
			tabviewMain.add(pageMain["pageControlDePrefacturaciones"]);
		}
		tabviewMain.setSelection([pageMain["pageControlDePrefacturaciones"]]);
	});
	mnuEdicion.add(btnControlDePrefacturaciones);
	
	
	var btnTrasladoyAlojamiento = new qx.ui.menu.Button("Panel de Traslado y Alojamiento...");
	btnTrasladoyAlojamiento.addListener("execute", function(){
		if (pageMain["pageTrasladoyAlojamiento"] == null) {
			pageMain["pageTrasladoyAlojamiento"] = new sacdiag.comp.pageTrasladoyAlojamiento();
			pageMain["pageTrasladoyAlojamiento"].addListenerOnce("close", function(e){
				pageMain["pageTrasladoyAlojamiento"] = null;
			});
			tabviewMain.add(pageMain["pageTrasladoyAlojamiento"]);
		}
		tabviewMain.setSelection([pageMain["pageTrasladoyAlojamiento"]]);
	});
	mnuEdicion.add(btnTrasladoyAlojamiento);
	
	
	var btnMedicamentos = new qx.ui.menu.Button("Panel de Medicamentos (Preliminar, en prueba) ...");
	btnMedicamentos.addListener("execute", function(){
		if (pageMain["pageMedicamentos"] == null) {
			pageMain["pageMedicamentos"] = new sacdiag.comp.pageMedicamentos();
			pageMain["pageMedicamentos"].addListenerOnce("close", function(e){
				pageMain["pageMedicamentos"] = null;
			});
			tabviewMain.add(pageMain["pageMedicamentos"]);
		}
		tabviewMain.setSelection([pageMain["pageMedicamentos"]]);
	});
	mnuEdicion.add(btnMedicamentos);
	
	
	mnuEdicion.addSeparator();
	
	
	var btnABMPrestadores = new qx.ui.menu.Button("ABM Prestadores...");
	btnABMPrestadores.addListener("execute", function(){
		if (pageMain["pageABMprestadores"] == null) {
			pageMain["pageABMprestadores"] = new sacdiag.comp.pageABMprestadores();
			pageMain["pageABMprestadores"].addListenerOnce("close", function(e){
				pageMain["pageABMprestadores"] = null;
			});
			tabviewMain.add(pageMain["pageABMprestadores"]);
		}
		tabviewMain.setSelection([pageMain["pageABMprestadores"]]);
	});
	mnuEdicion.add(btnABMPrestadores);
	mnuEdicion.addSeparator();
	
	
	var btnABMPrestaciones = new qx.ui.menu.Button("ABM Prestaciones...");
	btnABMPrestaciones.addListener("execute", function(){
		if (pageMain["pageABMprestaciones"] == null) {
			pageMain["pageABMprestaciones"] = new sacdiag.comp.pageABMprestaciones();
			pageMain["pageABMprestaciones"].addListenerOnce("close", function(e){
				pageMain["pageABMprestaciones"] = null;
			});
			tabviewMain.add(pageMain["pageABMprestaciones"]);
		}
		tabviewMain.setSelection([pageMain["pageABMprestaciones"]]);
	});
	mnuEdicion.add(btnABMPrestaciones);
	
	
	
	var btnABMTAPrestaciones = new qx.ui.menu.Button("ABM Traslado y Alojamiento prestaciones...");
	btnABMTAPrestaciones.addListener("execute", function(){
		if (pageMain["btnABMTAPrestaciones"] == null) {
			pageMain["btnABMTAPrestaciones"] = new sacdiag.comp.pageABMTAprestaciones();
			pageMain["btnABMTAPrestaciones"].addListenerOnce("close", function(e){
				pageMain["btnABMTAPrestaciones"] = null;
			});
			tabviewMain.add(pageMain["btnABMTAPrestaciones"]);
		}
		tabviewMain.setSelection([pageMain["btnABMTAPrestaciones"]]);
	});
	mnuEdicion.add(btnABMTAPrestaciones);
	
	
	var btnABMMedicamentos = new qx.ui.menu.Button("ABM Medicamentos (Preliminar, en prueba) ...");
	btnABMMedicamentos.addListener("execute", function(){
		if (pageMain["btnABMMedicamentos"] == null) {
			pageMain["btnABMMedicamentos"] = new sacdiag.comp.pageABMMedicamentos();
			pageMain["btnABMMedicamentos"].addListenerOnce("close", function(e){
				pageMain["btnABMMedicamentos"] = null;
			});
			tabviewMain.add(pageMain["btnABMMedicamentos"]);
		}
		tabviewMain.setSelection([pageMain["btnABMMedicamentos"]]);
	});
	mnuEdicion.add(btnABMMedicamentos);
	
	
	mnuEdicion.addSeparator();
	
	
	var btnParametros = new qx.ui.menu.Button("Parámetros...");
	btnParametros.addListener("execute", function(){
		var win = new sacdiag.comp.windowParametro();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuEdicion.add(btnParametros);

	

	

	
	
	
	var mnuVer = new qx.ui.menu.Menu();
	
	var btnEstadisticas = new qx.ui.menu.Button("Estadísticas...");
	btnEstadisticas.addListener("execute", function(){
		if (pageMain["pageParametros"] == null) {
			pageMain["pageParametros"] = new sacdiag.comp.pageParametros();
			pageMain["pageParametros"].addListenerOnce("close", function(e){
				pageMain["pageParametros"] = null;
			});
			tabviewMain.add(pageMain["pageParametros"]);
		}
		tabviewMain.setSelection([pageMain["pageParametros"]]);
	});
	mnuVer.add(btnEstadisticas);
	
	
	var btnWebServices = new qx.ui.menu.Button("Web services...");
	btnWebServices.addListener("execute", function(){
		var win = new sacdiag.comp.windowWebService('');
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuVer.add(btnWebServices);
	
	

	

	

	var mnuSesion = new qx.ui.menu.Menu();
	
	var btnContrasena = new qx.ui.menu.Button("Cambiar contraseña");
	btnContrasena.addListener("execute", function(e){
		var win = new sacdiag.comp.windowContrasena();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuSesion.add(btnContrasena);
	mnuSesion.addSeparator();

	var btnCerrar = new qx.ui.menu.Button("Cerrar");
	btnCerrar.addListener("execute", function(e){
		//var rpc = new qx.io.remote.Rpc("services/", "comp.turnos.login");
		//var result = rpc.callSync("Logout");
		location.reload(true);
	});
	mnuSesion.add(btnCerrar);
	
	  
	var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
	var mnubtnEdicion = new qx.ui.toolbar.MenuButton("Edición");
	var mnubtnVer = new qx.ui.toolbar.MenuButton('Ver');
	var mnubtnSesion = new qx.ui.toolbar.MenuButton('Sesión');

	
	mnubtnArchivo.setMenu(mnuArchivo);
	mnubtnEdicion.setMenu(mnuEdicion);
	mnubtnVer.setMenu(mnuVer);
	mnubtnSesion.setMenu(mnuSesion);
	  
	
	var toolbarMain = new qx.ui.toolbar.ToolBar();
	toolbarMain.add(mnubtnArchivo);
	toolbarMain.add(mnubtnEdicion);
	toolbarMain.add(mnubtnVer);
	toolbarMain.add(mnubtnSesion);
	toolbarMain.addSpacer();
	
	
	
	doc.add(toolbarMain, {left: 5, top: 0, right: "50%"});
	
	doc.add(new qx.ui.basic.Label("Usuario: " + this.login.usuario), {left: "51%", top: 5});
	doc.add(new qx.ui.basic.Label("Org/Area: " + this.login.label), {left: "51%", top: 25});
	
	
	//doc.add(contenedorMain, {left: 0, top: 33, right: 0, bottom: 0});
	//doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	//var pageGeneral = this.pageGeneral = new vehiculos.comp.pageGeneral();
	//tabviewMain.add(pageGeneral);
	//tabviewMain.setSelection([pageGeneral]);
	
	
	//var page = new sical3.comp.pageCatEspTit();
	//tabviewMain.add(page);
	//tabviewMain.setSelection([page]);
	
	
	btnPanelDeEstudiosEnProceso.execute();
	
	}
  }
});
