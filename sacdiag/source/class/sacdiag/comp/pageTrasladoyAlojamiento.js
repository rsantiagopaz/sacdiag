qx.Class.define("sacdiag.comp.pageTrasladoyAlojamiento",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Traslado y Alojamiento');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		btnFiltrar.execute();
		dtfDesde.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataSolicitud;
	var mapEstado = {
		"E" : "Emitida",
		"A" : "Aprobada",
		"B" : "Bloqueada",
		"C" : "Capturada",
		"L" : "Liberada",
		"F" : "Prefacturada",
		"P" : "para Pago"
	};
	
	
	
	
	
	var functionActualizarSolicitud = function(id_solicitud) {
		
		tblSolicitud.setFocusedCell();
		tableModelPrestacion.setDataAsMapArray([], true);
		
		btnAutorizar.setEnabled(false);
		btnBloquear.setEnabled(false);
		menuSolicitud.memorizar([btnAutorizar, btnBloquear]);
		
		controllerFormInfoEntsal.resetModel();
		
		
		
		var timer = qx.util.TimerManager.getInstance();
		if (this.timerId != null) {
			timer.stop(this.timerId);
			this.timerId = null;
			
			if (this.rpc != null) {
				this.rpc.abort(this.opaqueCallRef);
				this.rpc = null;
			}
		}
		
		this.timerId = timer.start(function() {
			
			var p = {};
			p.desde = dtfDesde.getValue();
			p.hasta = dtfHasta.getValue();
			p.id_prestador_fantasia = lstPrestador.getSelection()[0].getModel();
			if (! lstPaciente.isSelectionEmpty()) p.persona_id_paciente = lstPaciente.getSelection()[0].getModel();
			if (! lstPersonal.isSelectionEmpty()) p.id_personal_medico = lstPersonal.getSelection()[0].getModel();
			p.estado = slbEstado.getSelection()[0].getModel();
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.TA_Solicitudes");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
	
				tableModelSolicitud.setDataAsMapArray(data.result, true);
				
				if (id_solicitud != null) {
					tblSolicitud.blur();
					tblSolicitud.buscar("id_solicitud", id_solicitud);
					tblSolicitud.focus();
				}
			});
			
			this.rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			});
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_solicitud", p);
			
		}, null, this, null, 200);
	}
	
	
	
	
	
	var gbxFiltrar = new qx.ui.groupbox.GroupBox("Filtrar solicitudes");
	gbxFiltrar.setLayout(new qx.ui.layout.Grid(6, 6));
	this.add(gbxFiltrar, {left: 0, top: 0});
	
	

	gbxFiltrar.add(new qx.ui.basic.Label("Desde:"), {row: 0, column: 0});
	
	var dtfDesde = new qx.ui.form.DateField();
	gbxFiltrar.add(dtfDesde, {row: 0, column: 1});
	
	gbxFiltrar.add(new qx.ui.basic.Label("Hasta:"), {row: 1, column: 0});
	
	var dtfHasta = new qx.ui.form.DateField();
	gbxFiltrar.add(dtfHasta, {row: 1, column: 1});
	
	
	var aux = new Date;
	dtfHasta.setValue(aux);
	aux.setMonth(aux.getMonth() - 1);
	dtfDesde.setValue(aux);
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Prestador:"), {row: 2, column: 0});
	
	var cboPrestador = new qx.ui.form.SelectBox();
	cboPrestador.add(new qx.ui.form.ListItem("-", null, ""));
	
	var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
	rpc.addListener("completed", function(e){
		var data = e.getData();
		
		for (var x in data.result) {
			//listItem = new qx.ui.form.ListItem(data.result[x].nombre, null, data.result[x].organismo_area_id)
			cboPrestador.add(new qx.ui.form.ListItem(data.result[x].nombre, null, data.result[x].organismo_area_id));
		}
	});
	rpc.callAsyncListeners(true, "autocompletarPrestador", {texto: ""});
	
	
	//var cboPrestador = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestador"});
	//cboPrestador.setWidth(400);
	
	var lstPrestador = cboPrestador.getChildControl("list");

	//gbxFiltrar.add(cboPrestador, {row: 2, column: 1, colSpan: 3});
	
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Paciente:"), {row: 3, column: 0});
	
	var cboPaciente = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersona"});
	//cboPrestador.setWidth(400);
	
	var lstPaciente = cboPaciente.getChildControl("list");
	lstPaciente.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	gbxFiltrar.add(cboPaciente, {row: 3, column: 1, colSpan: 3});
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Médico:"), {row: 4, column: 0});
	
	var cboPersonal = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersonal"});
	//cboPrestador.setWidth(400);
	
	var lstPersonal = cboPersonal.getChildControl("list");
	lstPersonal.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	gbxFiltrar.add(cboPersonal, {row: 4, column: 1, colSpan: 3});
	
	
	
	gbxFiltrar.add(new qx.ui.basic.Label("Estado:"), {row: 5, column: 0});
	
	var slbEstado = new qx.ui.form.SelectBox();
	slbEstado.add(new qx.ui.form.ListItem("-", null, ""));
	slbEstado.add(new qx.ui.form.ListItem("Emitida", null, "E"));
	slbEstado.add(new qx.ui.form.ListItem("Aprobada", null, "A"));
	slbEstado.add(new qx.ui.form.ListItem("Bloqueada", null, "B"));
	//slbEstado.add(new qx.ui.form.ListItem("Capturada", null, "C"));
	slbEstado.add(new qx.ui.form.ListItem("Liberada", null, "L"));
	slbEstado.add(new qx.ui.form.ListItem("Prefacturada", null, "F"));
	slbEstado.add(new qx.ui.form.ListItem("para Pago", null, "P"));
	
	gbxFiltrar.add(slbEstado, {row: 5, column: 1});
	
	
	
	var btnInicializar = new qx.ui.form.Button("Inicializar");
	btnInicializar.addListener("execute", function(e){
		var aux = new Date;
		dtfHasta.setValue(aux);
		aux.setMonth(aux.getMonth() - 1);
		dtfDesde.setValue(aux);
		
		cboPrestador.setSelection([cboPrestador.getChildren()[0]]);
		
		lstPaciente.removeAll();
		cboPaciente.setValue("");
		
		lstPersonal.removeAll();
		cboPersonal.setValue("");
		
		slbEstado.setSelection([slbEstado.getChildren()[0]]);
		
		dtfDesde.focus();
	})
	gbxFiltrar.add(btnInicializar, {row: 6, column: 2});
	

	
	var btnFiltrar = new qx.ui.form.Button("Filtrar");
	btnFiltrar.addListener("execute", function(e){
		functionActualizarSolicitud();
	})
	gbxFiltrar.add(btnFiltrar, {row: 6, column: 3});
	
	
	
	
	
	// Menu
	
	var btnAutorizar = new qx.ui.menu.Button("Aprobar...");
	btnAutorizar.setEnabled(false);
	btnAutorizar.addListener("execute", function(e){
		(new dialog.Confirm({
		        "message"   : "Desea aprobar la solicitud seleccionada?",
		        "callback"  : function(e){
	        					if (e) {
									var focusedRow = tblSolicitud.getFocusedRow();
									
									tblSolicitud.blur();
									
									rowDataSolicitud.estado = "A";
									rowDataSolicitud.estado_descrip = mapEstado["A"];
									rowDataSolicitud.estado_condicion = 2;
									
									tableModelSolicitud.setRowsAsMapArray([rowDataSolicitud], focusedRow, true);
									
									var p = rowDataSolicitud;
									
									var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.TA_Solicitudes");
									rpc.addListener("completed", function(e){
										var data = e.getData();
										
										//alert(qx.lang.Json.stringify(data, null, 2));
										
										tblSolicitud.focus();
									});
									rpc.addListener("failed", function(e){
										var data = e.getData();
										
										if (data.message != "sesion_terminada") {
											alert(qx.lang.Json.stringify(data, null, 2));
										}
									});
									rpc.callAsyncListeners(true, "escribir_solicitud", p);
	        					}
		        			},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	
	var btnBloquear = new qx.ui.menu.Button("Bloquear...");
	btnBloquear.setEnabled(false);
	btnBloquear.addListener("execute", function(e){
		var focusedRow = tblSolicitud.getFocusedRow();
		
		var functionBloquear = function() {
			tableModelSolicitud.setRowsAsMapArray([rowDataSolicitud], focusedRow, true);
			
			var p = rowDataSolicitud;
			
			var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.TA_Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
	
				tblSolicitud.focus();
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				if (data.message != "sesion_terminada") {
					alert(qx.lang.Json.stringify(data, null, 2));
				}
			});
			rpc.callAsyncListeners(true, "escribir_solicitud", p);			
		}
		
		
		
		if (rowDataSolicitud.estado == "A") {
			var win = new sacdiag.comp.windowObservar();
			win.setCaption("Bloquear solicitud");
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
				
				rowDataSolicitud.estado = "B";
				rowDataSolicitud.estado_descrip = mapEstado["B"];
				rowDataSolicitud.estado_condicion = 3;
				rowDataSolicitud.observaciones_bloqueo = data;
				
				functionBloquear();
			});
			
			application.getRoot().add(win);
			win.center();
			win.open();
		} else {
			
			(new dialog.Confirm({
			        "message"   : "Desea desbloquear el item de solicitud seleccionado?",
			        "callback"  : function(e){
		        					if (e) {
										rowDataSolicitud.estado = "A";
										rowDataSolicitud.estado_descrip = mapEstado["A"];
										rowDataSolicitud.estado_condicion = 2;
										rowDataSolicitud.observaciones_bloqueo = "";
										functionBloquear();
		        					}
			        			},
			        "context"   : this,
			        "image"     : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	menuSolicitud.add(btnAutorizar);
	menuSolicitud.add(btnBloquear);
	menuSolicitud.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Paciente", "DNI", "Fecha", "Efector público", "Estado", "estado_condicion"], ["persona_nombre", "persona_dni", "f_emite", "efector_publico", "estado_descrip", "estado_condicion"]);
	tableModelSolicitud.setColumnSortable(0, false);
	tableModelSolicitud.setColumnSortable(1, false);
	tableModelSolicitud.setColumnSortable(2, false);
	tableModelSolicitud.setColumnSortable(3, false);
	tableModelSolicitud.setColumnSortable(4, false);
	tableModelSolicitud.setColumnSortable(5, false);
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

	
	var tableColumnModelSolicitud = tblSolicitud.getTableColumnModel();
	tableColumnModelSolicitud.setColumnVisible(5, false);
	
	var resizeBehaviorSolicitud = tableColumnModelSolicitud.getBehavior();
	
	resizeBehaviorSolicitud.set(0, {width:"24%", minWidth:100});
	resizeBehaviorSolicitud.set(1, {width:"9%", minWidth:100});
	resizeBehaviorSolicitud.set(2, {width:"9%", minWidth:100});
	resizeBehaviorSolicitud.set(3, {width:"24%", minWidth:100});
	resizeBehaviorSolicitud.set(4, {width:"10%", minWidth:100});

	

	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModelSolicitud.setDataCellRenderer(2, cellrendererDate);
	

	var cellrendererString = new qx.ui.table.cellrenderer.String();
	cellrendererString.addNumericCondition("==", 1, null, "#FF8000", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 2, null, "#119900", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 3, null, "#FF0000", null, null, "estado_condicion");
	tableColumnModelSolicitud.setDataCellRenderer(4, cellrendererString);
	
	
	
	
	
	var selectionModelSolicitud = tblSolicitud.getSelectionModel();
	selectionModelSolicitud.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSolicitud.addListener("changeSelection", function(e){
		if (selectionModelSolicitud.isSelectionEmpty()) {

		} else {
			
			rowDataSolicitud = tableModelSolicitud.getRowDataAsMap(tblSolicitud.getFocusedRow());
			
			controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(rowDataSolicitud));
			
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "E");
			btnBloquear.setEnabled(rowDataSolicitud.estado == "B" || rowDataSolicitud.estado == "A");
			btnBloquear.setLabel((rowDataSolicitud.estado == "B") ? "Desbloquear" : "Bloquear")
			
			menuSolicitud.memorizar([btnAutorizar, btnBloquear]);
			
			
			var timer = qx.util.TimerManager.getInstance();
			if (this.timerId != null) {
				timer.stop(this.timerId);
				this.timerId = null;
				
				if (this.rpc != null) {
					this.rpc.abort(this.opaqueCallRef);
					this.rpc = null;
				}
			}
			
			this.timerId = timer.start(function() {
				
				var p = {};
				p.id_ta_solicitud = rowDataSolicitud.id_ta_solicitud;
				
				this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.TA_Solicitudes");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
			
					tableModelPrestacion.setDataAsMapArray(data.result, true);
				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_solicitudes_prestaciones", p);
				
			}, null, this, null, 200);
		}
	});

	this.add(tblSolicitud, {left: "25%", top: 0, right: 0, bottom: "50%"});
	
	
	
	
	var gbxOtros = new qx.ui.groupbox.GroupBox("Otros datos");
	gbxOtros.setLayout(new qx.ui.layout.Grow());
	this.add(gbxOtros, {left: 0, top: "50%", right: "76%", bottom: 0});
	
	var containerScroll = new qx.ui.container.Scroll();
	gbxOtros.add(containerScroll);
	
	
	var formInfoEntsal = new qx.ui.form.Form();
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Obs.bloqueo", null, "observaciones_bloqueo");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Médico", null, "medico_descrip");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Info.clínica", null, "informacion_clinica");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Orientacion diagnostica", null, "orientacion_diagnostica");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Observaciones", null, "observaciones");
	
	aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Diagnostico CIE-10", null, "diagnostico");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Examen complementario", null, "examen_complementario");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Examen radiologico", null, "examen_radiologico");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Examen otros", null, "examen_otros");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Examen otro centro", null, "examen_otro_centro");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Tratamiento realizado", null, "tratamiento_realizado");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Fundamentacion", null, "fundamentacion");
	
	aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Servicio", null, "internacion_servicio");
	
	aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Cama", null, "internacion_cama");
	
	
	var controllerFormInfoEntsal = new qx.data.controller.Form(null, formInfoEntsal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal = new qx.ui.form.renderer.Single(formInfoEntsal);

	containerScroll.add(formViewEntsal);
	
	
	
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Prestación", "Establecimiento", "F.turno", "Estudios", "Acompañantes", "Dias", "Monto"], ["codigo", "descrip", "ta_establecimiento_descrip", "f_turno", "estudios_a_realizar", "cant_acompanantes", "cant_dias", "monto_presup"]);
	tableModelPrestacion.addListener("dataChanged", function(e){
		var rowCount = tableModelPrestacion.getRowCount();
		
		tblPrestacion.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPrestacion = new componente.comp.ui.ramon.table.Table(tableModelPrestacion, custom);
	tblPrestacion.setShowCellFocusIndicator(false);
	tblPrestacion.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	//tblPrestacion.setContextMenu(menuPrestacion);
	
	var tableColumnModelPrestacion = tblPrestacion.getTableColumnModel();
	
	var resizeBehaviorPrestacion = tableColumnModelPrestacion.getBehavior();

	//resizeBehaviorPrestacion.set(0, {width:"30%", minWidth:100});
	//resizeBehaviorPrestacion.set(1, {width:"70%", minWidth:100});
	//resizeBehaviorPrestacion.set(2, {width:"60%", minWidth:100});

	
	
	var selectionModelPrestacion = tblPrestacion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){

	});

	this.add(tblPrestacion, {left: "25%", top: "52%", right: 0, bottom: 0});

	
	
	
	
	
		
	},
	members : 
	{

	}
});