/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "servicio_social"
 *
 * @asset(servicio_social/*)
 */
qx.Class.define("servicio_social.Application",
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
	

	
	
	var win = new servicio_social.comp.windowLogin();
	win.setModal(true);
	win.addListenerOnce("appear", function(e){
		win.center();
	});
	win.addListener("aceptado", function(e){
		var data = e.getData();
		
		this.login = data;
		//alert(qx.lang.Json.stringify(data, null, 2));
		
		this._InitAPP();
	}, this)
	//doc.add(win);
	//win.center();
	win.open();
	
	
	
	
	
	
    },
    
	_InitAPP : function ()
	{
		
      // Document is the application root
	var doc = this.getRoot();
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	
	
	
	

	
	var pagePanelDeEstudiosEnProceso;
	var pageControlDePrefacturaciones;
	var pageABMprestaciones;
	var pageABMprestadores;
	var pageParametros;

	
	
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
	
	
	var loading = this.loading = new componente.comp.ui.ramon.image.Loading("servicio_social/loading66.gif");
      

	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this.tabviewMain = new qx.ui.tabview.TabView();
	doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	//contenedorMain.add(tabviewMain);
	
	
	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		var win = new servicio_social.comp.windowAcercaDe();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	var mnuEdicion = new qx.ui.menu.Menu();
	
	
	
	var btnPanelDeEstudiosEnProceso = new qx.ui.menu.Button("Panel de Estudios en Proceso...");
	btnPanelDeEstudiosEnProceso.addListener("execute", function(){
		if (pagePanelDeEstudiosEnProceso == null) {
			pagePanelDeEstudiosEnProceso = new servicio_social.comp.pagePanelDeEstudiosEnProceso();
			pagePanelDeEstudiosEnProceso.addListenerOnce("close", function(e){
				pagePanelDeEstudiosEnProceso = null;
			});
			tabviewMain.add(pagePanelDeEstudiosEnProceso);
		}
		tabviewMain.setSelection([pagePanelDeEstudiosEnProceso]);
	});
	mnuEdicion.add(btnPanelDeEstudiosEnProceso);
	
	
	var btnControlDePrefacturaciones = new qx.ui.menu.Button("Control de Prefacturaciones...");
	btnControlDePrefacturaciones.addListener("execute", function(){
		if (pageControlDePrefacturaciones == null) {
			pageControlDePrefacturaciones = new servicio_social.comp.pageControlDePrefacturaciones();
			pageControlDePrefacturaciones.addListenerOnce("close", function(e){
				pageControlDePrefacturaciones = null;
			});
			tabviewMain.add(pageControlDePrefacturaciones);
		}
		tabviewMain.setSelection([pageControlDePrefacturaciones]);
	});
	mnuEdicion.add(btnControlDePrefacturaciones);
	
	
	mnuEdicion.addSeparator();
	
	
	var btnABMPrestaciones = new qx.ui.menu.Button("ABM Prestaciones...");
	btnABMPrestaciones.addListener("execute", function(){
		if (pageABMprestaciones == null) {
			pageABMprestaciones = new servicio_social.comp.pageABMprestaciones();
			pageABMprestaciones.addListenerOnce("close", function(e){
				pageABMprestaciones = null;
			});
			tabviewMain.add(pageABMprestaciones);
		}
		tabviewMain.setSelection([pageABMprestaciones]);
	});
	mnuEdicion.add(btnABMPrestaciones);
	
	
	var btnABMPrestadores = new qx.ui.menu.Button("ABM Prestadores...");
	btnABMPrestadores.addListener("execute", function(){
		if (pageABMprestadores == null) {
			pageABMprestadores = new servicio_social.comp.pageABMprestadores();
			pageABMprestadores.addListenerOnce("close", function(e){
				pageABMprestadores = null;
			});
			tabviewMain.add(pageABMprestadores);
		}
		tabviewMain.setSelection([pageABMprestadores]);
	});
	mnuEdicion.add(btnABMPrestadores);
	
	


	

	

	
	
	
	var mnuVer = new qx.ui.menu.Menu();
	
	var btnEstadisticas = new qx.ui.menu.Button("Estadísticas...");
	btnEstadisticas.addListener("execute", function(){
		if (pageParametros == null) {
			pageParametros = new servicio_social.comp.pageParametros();
			pageParametros.addListenerOnce("close", function(e){
				pageParametros = null;
			});
			tabviewMain.add(pageParametros);
		}
		tabviewMain.setSelection([pageParametros]);
	});
	mnuVer.add(btnEstadisticas);
	
	

	

	

	var mnuSesion = new qx.ui.menu.Menu();
	
	var btnContrasena = new qx.ui.menu.Button("Cambiar contraseña");
	btnContrasena.addListener("execute", function(e){
		var win = new servicio_social.comp.windowContrasena();
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
