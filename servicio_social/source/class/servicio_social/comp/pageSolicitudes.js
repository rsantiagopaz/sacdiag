qx.Class.define("servicio_social.comp.pageSolicitudes",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Solicitudes');
	//this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		tblSolicitud.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowData;
	
	
	
	var functionActualizarSolicitud = function(id_ta_solicitud) {
		var p = {};
		
		var rpc = new servicio_social.comp.rpc.Rpc("services/", "comp.Solicitudes");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModelSolicitud.setDataAsMapArray(data.result, true);
			
			if (id_ta_solicitud != null) {
				tblSolicitud.blur();
				tblSolicitud.buscar("id_ta_solicitud", id_ta_solicitud);
				tblSolicitud.focus();
			}
		});
		rpc.callAsyncListeners(true, "leer_solicitudes", p);
		
		return rpc;
	}
	

	

	// Menu

	
	var commandAgregarSolicitud = new qx.ui.command.Command("Insert");
	commandAgregarSolicitud.addListener("execute", function(e){
		if (application.pagesMain.pageAlta == null) {
			application.pagesMain.pageAlta = new servicio_social.comp.pageFormularioDeDatos();
			application.pagesMain.pageAlta.addListener("aceptado", function(e){
				var data = e.getData();
				
				functionActualizarSolicitud(data);
			});
			application.pagesMain.pageAlta.addListenerOnce("close", function(e){
				application.pagesMain.pageAlta = null;
			});
			
			application.tabviewMain.add(application.pagesMain.pageAlta);
		}
		
		application.tabviewMain.setSelection([application.pagesMain.pageAlta]);
	});
	
	var btnAgregarSolicitud = new qx.ui.menu.Button("Agregar...", null, commandAgregarSolicitud);
	
	
	var commandEditarSolicitud = new qx.ui.command.Command("Enter");
	commandEditarSolicitud.setEnabled(false);
	commandEditarSolicitud.addListener("execute", function(e){
		if (application.pagesMain["id" + rowData.id_ta_solicitud] == null) {
			application.pagesMain["id" + rowData.id_ta_solicitud] = new servicio_social.comp.pageFormularioDeDatos(rowData);
			application.pagesMain["id" + rowData.id_ta_solicitud].addListener("aceptado", function(e){
				var data = e.getData();
				
				functionActualizarSolicitud(data);
			});
			application.pagesMain["id" + rowData.id_ta_solicitud].addListenerOnce("close", function(e){
				application.pagesMain["id" + rowData.id_ta_solicitud] = null;
			});
			
			application.tabviewMain.add(application.pagesMain["id" + rowData.id_ta_solicitud]);
		}
		
		application.tabviewMain.setSelection([application.pagesMain["id" + rowData.id_ta_solicitud]]);
	});
	
	var btnEditarSolicitud = new qx.ui.menu.Button("Modificar...", null, commandEditarSolicitud);
	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	menuSolicitud.add(btnAgregarSolicitud);
	menuSolicitud.add(btnEditarSolicitud);
	menuSolicitud.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Fecha", "Paciente", "DNI", "Estado", "estado_condicion"], ["f_emite", "paciente", "dni", "estado_descrip", "estado_condicion"]);
	tableModelSolicitud.addListener("dataChanged", function(e){
		var rowCount = tableModelSolicitud.getRowCount();
		
		tblSolicitud.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSolicitud = new componente.comp.ui.ramon.table.Table(tableModelSolicitud, custom);
	tblSolicitud.setShowCellFocusIndicator(false);
	tblSolicitud.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblSolicitud.setContextMenu(menuSolicitud);
	tblSolicitud.addListener("cellDbltap", function(e){
		commandEditarSolicitud.execute();
	});

	
	var tableColumnModelSolicitud = tblSolicitud.getTableColumnModel();
	tableColumnModelSolicitud.setColumnVisible(4, false);
	
	var resizeBehaviorSolicitud = tableColumnModelSolicitud.getBehavior();
	/*
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"5%", minWidth:100});
	resizeBehavior.set(2, {width:"5%", minWidth:100});
	resizeBehavior.set(3, {width:"21%", minWidth:100});
	resizeBehavior.set(4, {width:"5%", minWidth:100});
	resizeBehavior.set(5, {width:"21%", minWidth:100});
	resizeBehavior.set(6, {width:"5%", minWidth:100});
	resizeBehavior.set(7, {width:"5%", minWidth:100});
	resizeBehavior.set(8, {width:"21%", minWidth:100});
	resizeBehavior.set(9, {width:"4%", minWidth:100});
	resizeBehavior.set(10, {width:"5%", minWidth:100});

	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	cellrendererBoolean.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererBoolean);
	
	var cellrendererDate = new defineMultiLineCellDate();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
	tableColumnModel.setDataCellRenderer(1, cellrendererDate);
	
	var cellrenderer = new defineMultiLineCellHtml();
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	tableColumnModel.setDataCellRenderer(4, cellrenderer);
	tableColumnModel.setDataCellRenderer(5, cellrenderer);
	tableColumnModel.setDataCellRenderer(6, cellrenderer);
	tableColumnModel.setDataCellRenderer(7, cellrenderer);
	tableColumnModel.setDataCellRenderer(8, cellrenderer);
	tableColumnModel.setDataCellRenderer(9, cellrenderer);
	tableColumnModel.setDataCellRenderer(10, cellrenderer);
	*/
	
	
	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModelSolicitud.setDataCellRenderer(0, cellrendererDate);
	

	var cellrendererString = new qx.ui.table.cellrenderer.String();
	cellrendererString.addNumericCondition("==", 1, null, "#FF8000", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 2, null, "#119900", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 3, null, "#FF0000", null, null, "estado_condicion");
	tableColumnModelSolicitud.setDataCellRenderer(3, cellrendererString);
	
	
	var selectionModelSolicitud = tblSolicitud.getSelectionModel();
	selectionModelSolicitud.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSolicitud.addListener("changeSelection", function(e){
		if (! selectionModelSolicitud.isSelectionEmpty()) {
			rowData = tableModelSolicitud.getRowDataAsMap(tblSolicitud.getFocusedRow());
			
			commandEditarSolicitud.setEnabled(rowData.estado == "E");
		} else {
			commandEditarSolicitud.setEnabled(false);
		}
		
		menuSolicitud.memorizar([commandEditarSolicitud]);
	});

	this.add(tblSolicitud, {left: 0, top: 20, right: "51%", bottom: 0});
	
	
	
	functionActualizarSolicitud();
	
		
	},
	members : 
	{

	}
});