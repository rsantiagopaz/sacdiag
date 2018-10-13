qx.Class.define("sacdiag.comp.pageABMprestadores",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('ABM prestadores');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		//cboTitulo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataPrestador;
	var rowDataRS;
	var rowDataPrestacion;
	
	
	
	var functionActualizarPrestador = function(organismo_area_id) {
		
		tblPrestador.blur();
		tblPrestador.setFocusedCell();
		tblPrestacion.setFocusedCell();
		
		btnEstadoPrestacion.setEnabled(false);
		menuPrestacion.memorizar([btnEstadoPrestacion]);
		
		tableModelRS.setDataAsMapArray([], true);
		
		btnAgregarPrestacion.setEnabled(false);
		tableModelPrestacion.setDataAsMapArray([], true);
		
		txtSemanal_descrip.setValue("");
		txtMensual_descrip.setValue("");
		
		
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
		
			this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
	
				tableModelPrestador.setDataAsMapArray(data.result, true);
				
				if (organismo_area_id != null) {
					tblPrestador.blur();
					tblPrestador.buscar("organismo_area_id", organismo_area_id);
					tblPrestador.focus();
				}
			});
			this.rpc.addListener("failed", function(e){
				var data = e.getData();
				
				if (data.message != "sesion_terminada") alert(qx.lang.Json.stringify(data, null, 2));
			});
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "autocompletarPrestador", p);
		
		}, null, this, null, 200);
	}
	
	
	
	var functionActualizarRS = function(id_prestador) {
		
		tblRS.blur();
		tblRS.setFocusedCell();
		tblPrestacion.setFocusedCell();
		
		btnAgregarPrestacion.setEnabled(false);
		tableModelPrestacion.setDataAsMapArray([], true);
		

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
			p.organismo_area_id = rowDataPrestador.organismo_area_id;
			
			this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
	
				tableModelRS.setDataAsMapArray(data.result, true);
				
				if (id_prestador != null) {
					tblRS.blur();
					tblRS.buscar("id_prestador", id_prestador);
					tblRS.focus();
				}
			});
			this.rpc.addListener("failed", function(e){
				var data = e.getData();
				
				if (data.message != "sesion_terminada") alert(qx.lang.Json.stringify(data, null, 2));
			});
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "autocompletarRS", p);
		
		}, null, this, null, 200);
	}
	
	
	var functionActualizarPrestacion = function(id_prestador_prestacion) {
		
		tblPrestacion.blur();
		tblPrestacion.setFocusedCell();
		
		
		var timer = qx.util.TimerManager.getInstance();
		if (this.timerId != null) {
			timer.stop(this.timerId);
			this.timerId = null;
			
			if (this.rpc != null) {
				this.rpc.abort(this.opaqueCallRef);
				this.rpc = null;
			}
		}
		
		var p = {};
		p.id_prestador = rowDataRS.id_prestador;
		
		var rpcAux = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
		rpcAux.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModelPrestacion.setDataAsMapArray(data.result, true);
			
			if (id_prestador_prestacion != null) {
				tblPrestacion.blur();
				tblPrestacion.buscar("id_prestador_prestacion", id_prestador_prestacion);
				tblPrestacion.focus();
			}
		});
		rpcAux.addListener("failed", function(e){
			var data = e.getData();
			
			if (data.message != "sesion_terminada") alert(qx.lang.Json.stringify(data, null, 2));
		});
		
		this.timerId = timer.start(function() {
			this.rpc = rpcAux;
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_prestador_prestacion", p);
		
		}, null, this, null, 200);

		return rpcAux;
	}
	
	

	
	var compositePrestador = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(compositePrestador, {left: 0, top: 0, right: "51%", bottom: "43%"});
	
	var compositeRS = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(compositeRS, {left: 0, top: "60%", right: "51%", bottom: 0});
	
	
	
	
	
	
	
	// Menu

	var btnAgregarPrestador = new qx.ui.menu.Button("Agregar...");
	btnAgregarPrestador.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestador();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestador(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var btnEditarPrestador = new qx.ui.menu.Button("Editar...");
	btnEditarPrestador.setEnabled(false);
	btnEditarPrestador.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestador(rowDataPrestador);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestador(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var menuPrestador = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrestador.add(btnAgregarPrestador);
	menuPrestador.add(btnEditarPrestador);
	menuPrestador.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestador = new qx.ui.table.model.Simple();
	tableModelPrestador.setColumns(["Descripción", "Domicilio", "Teléfono", "Contacto", "C.semanal", "C.mensual"], ["nombre", "domicilio", "telefonos", "contacto", "cronograma_semanal", "cronograma_mensual"]);
	tableModelPrestador.addListener("dataChanged", function(e){
		var rowCount = tableModelPrestador.getRowCount();
		
		tblPrestador.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPrestador = new componente.comp.ui.ramon.table.Table(tableModelPrestador, custom);
	tblPrestador.setShowCellFocusIndicator(false);
	tblPrestador.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblPrestador.setContextMenu(menuPrestador);

	
	var tableColumnModelPrestador = tblPrestador.getTableColumnModel();
	
	var resizeBehaviorPrestador = tableColumnModelPrestador.getBehavior();

	resizeBehaviorPrestador.set(0, {width:"30%", minWidth:100});
	resizeBehaviorPrestador.set(1, {width:"30%", minWidth:100});
	resizeBehaviorPrestador.set(2, {width:"15%", minWidth:100});
	resizeBehaviorPrestador.set(3, {width:"10%", minWidth:100});
	resizeBehaviorPrestador.set(4, {width:"7.5%", minWidth:100});
	resizeBehaviorPrestador.set(5, {width:"7.5%", minWidth:100});
	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	tableColumnModelPrestador.setDataCellRenderer(4, cellrendererBoolean);
	tableColumnModelPrestador.setDataCellRenderer(5, cellrendererBoolean);

	
	
	var selectionModelPrestador = tblPrestador.getSelectionModel();
	selectionModelPrestador.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestador.addListener("changeSelection", function(e){
		if (! selectionModelPrestador.isSelectionEmpty()) {
			rowDataPrestador = tableModelPrestador.getRowDataAsMap(tblPrestador.getFocusedRow());
			
			txtSemanal_descrip.setValue(rowDataPrestador.semanal_descrip);
			txtMensual_descrip.setValue(rowDataPrestador.mensual_descrip);
			
			//btnAgregarPrestacion.setEnabled(true);
			
			functionActualizarRS();
			
			btnEditarPrestador.setEnabled(true);
			menuRS.memorizarEnabled([btnAgregarRS], true);
		} else {
			btnEditarPrestador.setEnabled(false);
		}
		
		menuPrestador.memorizar([btnEditarPrestador]);
	});

	compositePrestador.add(tblPrestador, {left: 0, top: 20, right: 0, bottom: 110});
	
	compositePrestador.add(new qx.ui.basic.Label("Prestador"), {left: 0, top: 0});
	
	
	
	
	
	
	
	// Menu

	var btnAgregarRS = new qx.ui.menu.Button("Agregar...");
	btnAgregarRS.setEnabled(false);
	btnAgregarRS.addListener("execute", function(e){
		var win = new sacdiag.comp.windowRazonSocial(null, rowDataPrestador.organismo_area_id);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarRS(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var btnEditarRS = new qx.ui.menu.Button("Editar...");
	btnEditarRS.setEnabled(false);
	btnEditarRS.addListener("execute", function(e){
		var win = new sacdiag.comp.windowRazonSocial(rowDataRS, rowDataPrestador.organismo_area_id);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarRS(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var menuRS = new componente.comp.ui.ramon.menu.Menu();
	
	menuRS.add(btnAgregarRS);
	menuRS.add(btnEditarRS);
	menuRS.memorizar();
	
	
	
	//Tabla
	
	
	var tableModelRS = new qx.ui.table.model.Simple();
	tableModelRS.setColumns(["Descripción", "CUIT", "Domicilio", "Teléfono", "Contacto"], ["nombre", "cuit", "domicilio", "telefonos", "contacto"]);
	tableModelRS.addListener("dataChanged", function(e){
		var rowCount = tableModelRS.getRowCount();
		
		tblRS.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblRS = new componente.comp.ui.ramon.table.Table(tableModelRS, custom);
	tblRS.setShowCellFocusIndicator(false);
	tblRS.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblRS.setContextMenu(menuRS);

	
	var tableColumnModelRS = tblRS.getTableColumnModel();
	
	var resizeBehaviorRS = tableColumnModelRS.getBehavior();

	resizeBehaviorRS.set(0, {width:"30%", minWidth:100});
	resizeBehaviorRS.set(1, {width:"15%", minWidth:100});
	resizeBehaviorRS.set(2, {width:"30%", minWidth:100});
	resizeBehaviorRS.set(3, {width:"15%", minWidth:100});
	resizeBehaviorRS.set(4, {width:"10%", minWidth:100});

	
	
	var selectionModelRS = tblRS.getSelectionModel();
	selectionModelRS.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelRS.addListener("changeSelection", function(e){
		if (! selectionModelRS.isSelectionEmpty()) {
			rowDataRS = tableModelRS.getRowDataAsMap(tblRS.getFocusedRow());
		
			btnAgregarPrestacion.setEnabled(true);
			
			functionActualizarPrestacion();
			
			btnEditarRS.setEnabled(true);
		} else {
			btnEditarRS.setEnabled(false);
		}
		
		menuRS.memorizar([btnEditarRS]);
	});

	compositeRS.add(tblRS, {left: 0, top: 20, right: 0, bottom: 0});	
	
	compositeRS.add(new qx.ui.basic.Label("Razón social"), {left: 0, top: 0});
	
	
	
	
	
	
	
	
	
	
	
	var aux = new qx.ui.layout.HBox(6);
	aux.setAlignY("middle");
	
	var composite = new qx.ui.container.Composite(aux);
	this.add(composite, {left: "53%", top: 0});
	
	composite.add(new qx.ui.basic.Label("Prestación:"));
	
	var cboPrestacion = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestacion"});
	cboPrestacion.setWidth(400);
	
	var lstPrestacion = cboPrestacion.getChildControl("list");
	lstPrestacion.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	composite.add(cboPrestacion);
	
	
	var btnAgregarPrestacion = new qx.ui.form.Button("Agregar");
	btnAgregarPrestacion.addListener("execute", function(e){
		if (! lstPrestacion.isSelectionEmpty()) {
			var model = lstPrestacion.getSelection()[0].getModel();
			
			if (tblPrestacion.buscar("id_prestacion", model) == null) {
				var p = {};
				p.id_prestador = rowDataRS.id_prestador;
				p.id_prestacion = model;
				
				//alert(qx.lang.Json.stringify(p, null, 2));
				
				var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					lstPrestacion.resetSelection();
					cboPrestacion.setValue("");
					
					var rpc = functionActualizarPrestacion(data.result);
					rpc.addListener("completed", function(e){
						cboPrestacion.focus();
					})
				});
				rpc.callAsyncListeners(true, "agregar_prestador_prestacion", p);
			}
		} else {
			cboPrestacion.focus();
		}
	});
	composite.add(btnAgregarPrestacion);
	
	
	
	
	
	
	
	
	
	
	// Menu


	var rgItem = new qx.ui.form.RadioGroup();
	
	var btnEstadoHabilitadoItem = new qx.ui.menu.RadioButton("Habilitado");
	btnEstadoHabilitadoItem.setValue(true);
	btnEstadoHabilitadoItem.addListener("execute", function(e){
		rowDataPrestacion.estado = "H";
		
		tableModelPrestacion.setRowsAsMapArray([rowDataPrestacion], tblPrestacion.getFocusedRow(), true);
		
		
		var p = rowDataPrestacion;
		
		var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
		rpc.callAsyncListeners(true, "escribir_estado", p);
	});
	var btnEstadoSuspendidoItem = new qx.ui.menu.RadioButton("Suspendido");
	btnEstadoSuspendidoItem.addListener("execute", function(e){
		rowDataPrestacion.estado = "S";
		
		tableModelPrestacion.setRowsAsMapArray([rowDataPrestacion], tblPrestacion.getFocusedRow(), true);
		
		
		var p = rowDataPrestacion;
		
		var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
		rpc.callAsyncListeners(true, "escribir_estado", p);
	});
	
	var menuEstadoItem = new componente.comp.ui.ramon.menu.Menu();
	menuEstadoItem.add(btnEstadoHabilitadoItem);
	menuEstadoItem.add(btnEstadoSuspendidoItem);
	
	rgItem.add(btnEstadoHabilitadoItem);
	rgItem.add(btnEstadoSuspendidoItem);
	
	
	
	
	
	
	

	
	var btnEstadoHabilitadoSubtipo = new qx.ui.menu.Button("Habilitado");
	btnEstadoHabilitadoSubtipo.addListener("execute", function(e){
		if (rowDataPrestacion.id_prestacion_subtipo) {
			var p = {};
			p.estado = "H";
			p.id_prestador = rowDataRS.id_prestador;
			p.id_prestacion_subtipo = rowDataPrestacion.id_prestacion_subtipo;
			
			var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				functionActualizarPrestacion(rowDataPrestacion.id_prestador_prestacion);
			});
			rpc.callAsyncListeners(true, "escribir_estado", p);
		}
	});
	var btnEstadoSuspendidoSubtipo = new qx.ui.menu.Button("Suspendido");
	btnEstadoSuspendidoSubtipo.addListener("execute", function(e){
		if (rowDataPrestacion.id_prestacion_subtipo) {
			var p = {};
			p.estado = "S";
			p.id_prestador = rowDataRS.id_prestador;
			p.id_prestacion_subtipo = rowDataPrestacion.id_prestacion_subtipo;
			
			var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				functionActualizarPrestacion(rowDataPrestacion.id_prestador_prestacion);
			});
			rpc.callAsyncListeners(true, "escribir_estado", p);
		}
	});
	
	var menuEstadoSubtipo = new componente.comp.ui.ramon.menu.Menu();
	menuEstadoSubtipo.add(btnEstadoHabilitadoSubtipo);
	menuEstadoSubtipo.add(btnEstadoSuspendidoSubtipo);
	
	
	
	
	
	var btnEstadoPrestacionItem = new qx.ui.menu.Button("Item", null, null, menuEstadoItem);
	var btnEstadoPrestacionSubtipo = new qx.ui.menu.Button("x Subtipo", null, null, menuEstadoSubtipo);
	
	
	var menuEstado = new componente.comp.ui.ramon.menu.Menu();
	menuEstado.add(btnEstadoPrestacionItem);
	menuEstado.add(btnEstadoPrestacionSubtipo);
	
	
	
	
	
	
	var btnEstadoPrestacion = new qx.ui.menu.Button("Estado", null, null, menuEstado);
	btnEstadoPrestacion.setEnabled(false);
	
	
	var btnEliminarPrestacion = new qx.ui.menu.Button("Eliminar...");
	btnEliminarPrestacion.addListener("execute", function(e){

	});
	
	
	var menuPrestacion = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrestacion.add(btnEstadoPrestacion);
	//menuPrestacion.addSeparator();
	//menuPrestacion.add(btnEliminarPrestacion);
	menuPrestacion.memorizar();
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Descripción", "Valor", "Subtipo", "Estado"], ["codigo", "denominacion", "valor", "subtipo_descrip", "estado"]);
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
	tblPrestacion.setContextMenu(menuPrestacion);
	
	var tableColumnModelPrestacion = tblPrestacion.getTableColumnModel();
	
	var resizeBehaviorPrestacion = tableColumnModelPrestacion.getBehavior();
	resizeBehaviorPrestacion.set(0, {width:"12%", minWidth:100});
	resizeBehaviorPrestacion.set(1, {width:"56%", minWidth:100});
	resizeBehaviorPrestacion.set(2, {width:"10%", minWidth:100});
	resizeBehaviorPrestacion.set(3, {width:"12%", minWidth:100});
	resizeBehaviorPrestacion.set(4, {width:"10%", minWidth:100});
	
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelPrestacion.setDataCellRenderer(2, cellrendererNumber);


	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"H" : "Habilitado",
		"S" : "Suspendido"
	});
	tableColumnModelPrestacion.setDataCellRenderer(4, cellrendererReplace);
	

	
	var selectionModelPrestacion = tblPrestacion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){
		if (! selectionModelPrestacion.isSelectionEmpty()) {
			rowDataPrestacion = tableModelPrestacion.getRowDataAsMap(tblPrestacion.getFocusedRow());
			
			btnEstadoHabilitadoItem.setValue(rowDataPrestacion.estado == "H");
			btnEstadoSuspendidoItem.setValue(rowDataPrestacion.estado == "S");
			
			btnEstadoPrestacion.setEnabled(true);
			btnEliminarPrestacion.setEnabled(true);
		} else {
			btnEstadoPrestacion.setEnabled(false);
			btnEliminarPrestacion.setEnabled(false);
		}
		
		menuPrestacion.memorizar([btnEstadoPrestacion, btnEliminarPrestacion]);
	});

	this.add(tblPrestacion, {left: "51%", top: 30, right: 0, bottom: 0});
	
	//this.add(new qx.ui.basic.Label("Prestación"), {left: "53%", top: 0});
	
	
	
	var form = new qx.ui.form.Form();
	
	var txtSemanal_descrip = new qx.ui.form.TextField();
	txtSemanal_descrip.setReadOnly(true);
	txtSemanal_descrip.setMinWidth(200);
	txtSemanal_descrip.setDecorator("main");
	txtSemanal_descrip.setBackgroundColor("#ffffc0");
	form.add(txtSemanal_descrip, "Sig.semanal", null, "sig_semanal");
	var txtMensual_descrip = new qx.ui.form.TextField();
	txtMensual_descrip.setReadOnly(true);
	txtMensual_descrip.setMinWidth(200);
	txtMensual_descrip.setDecorator("main");
	txtMensual_descrip.setBackgroundColor("#ffffc0");
	form.add(txtMensual_descrip, "Sig.mensual", null, "sig_mensual");
	
	form.addGroupHeader("Turno actual");
	
	var txtTurnoSemanal_descrip = new qx.ui.form.TextField();
	txtTurnoSemanal_descrip.setReadOnly(true);
	txtTurnoSemanal_descrip.setMinWidth(200);
	txtTurnoSemanal_descrip.setDecorator("main");
	txtTurnoSemanal_descrip.setBackgroundColor("#ffffc0");
	form.add(txtTurnoSemanal_descrip, "Semanal", null, "turno_semanal");
	var txtTurnoMensual_descrip = new qx.ui.form.TextField();
	txtTurnoMensual_descrip.setReadOnly(true);
	txtTurnoMensual_descrip.setMinWidth(200);
	txtTurnoMensual_descrip.setDecorator("main");
	txtTurnoMensual_descrip.setBackgroundColor("#ffffc0");
	form.add(txtTurnoMensual_descrip, "Mensual", null, "turno_mensual");
	
	var txtFechaSemanal_descrip = new qx.ui.form.TextField();
	txtFechaSemanal_descrip.setReadOnly(true);
	txtFechaSemanal_descrip.setMinWidth(200);
	txtFechaSemanal_descrip.setDecorator("main");
	txtFechaSemanal_descrip.setBackgroundColor("#ffffc0");
	form.add(txtFechaSemanal_descrip, "", null, "turno_semanal");
	var txtFechaMensual_descrip = new qx.ui.form.TextField();
	txtFechaMensual_descrip.setReadOnly(true);
	txtFechaMensual_descrip.setMinWidth(200);
	txtFechaMensual_descrip.setDecorator("main");
	txtFechaMensual_descrip.setBackgroundColor("#ffffc0");
	form.add(txtFechaMensual_descrip, "", null, "turno_mensual");

	var formView = new qx.ui.form.renderer.Double(form);
	
	compositePrestador.add(formView, {left: 0, bottom: 0});
	
	
	functionActualizarPrestador();
	
	
	
	var rpcSemanal = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
	rpcSemanal.addListener("completed", function(e){
		var data = e.getData();
		
		txtTurnoSemanal_descrip.setValue(data.result.nombre);
		txtFechaSemanal_descrip.setValue(data.result.periodo_descrip);
	});
	rpcSemanal.callAsyncListeners(true, "calcular_turno_semanal");
	
	
	var rpcMensual = new sacdiag.comp.rpc.Rpc("services/", "comp.Parametros");
	rpcMensual.addListener("completed", function(e){
		var data = e.getData();
		
		txtTurnoMensual_descrip.setValue(data.result.nombre);
		txtFechaMensual_descrip.setValue(data.result.periodo_descrip);
	});
	rpcMensual.callAsyncListeners(true, "calcular_turno_mensual");
	
	
		
	},
	members : 
	{

	}
});