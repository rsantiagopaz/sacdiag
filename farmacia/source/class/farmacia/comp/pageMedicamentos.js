qx.Class.define("farmacia.comp.pageMedicamentos",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Panel de Medicamentos');
	//this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		btnFiltrar.execute();
		dtfDesde.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataSolicitud;
	var rowDataPrestacion;
	
	var mapEstado = {
		"EH" : "Emitida Hospital",
		"AS" : "Autorizada Ser.Soc.Min.",
		"DS" : "Denegada Ser.Soc.Min.",
		"AA" : "Autorizada Aud.Med.Min.",
		"DA" : "Denegada Aud.Med.Min.",
		"EF" : "Entregada Farmacia",
		"DF" : "Denegada Farmacia"
	};
	
	
	
	
	
	var functionActualizarSolicitud = function(id_m_solicitud) {
		
		tblSolicitud.setFocusedCell();
		tblPrestacion.setFocusedCell();
		
		tableModelSolicitud.setDataAsMapArray([], true);
		tableModelPrestacion.setDataAsMapArray([], true);
		
		btnAutorizar.setEnabled(false);
		btnWebServices.setEnabled(false);
		menuSolicitud.memorizar([btnAutorizar, btnWebServices]);
		
		controllerFormInfoEntsal.resetModel();
		controllerFormInfoEntsal2.resetModel();
		
		
		
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
			if (! lstPaciente.isSelectionEmpty()) p.persona_id_paciente = lstPaciente.getSelection()[0].getModel();
			p.id_m_tipo_producto = slbTipoProducto.getSelection()[0].getModel();
			if (! lstVademecum.isSelectionEmpty()) p.id_m_vademecum = lstVademecum.getSelection()[0].getModel();
			if (! lstPersonal.isSelectionEmpty()) p.id_personal_medico = lstPersonal.getSelection()[0].getModel();
			p.estado = slbEstado.getSelection()[0].getModel();
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			this.rpc = new farmacia.comp.rpc.Rpc("services/", "comp.M_Solicitudes");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
	
				tableModelSolicitud.setDataAsMapArray(data.result, true);
				
				if (id_m_solicitud != null) {
					tblSolicitud.blur();
					tblSolicitud.buscar("id_m_solicitud", id_m_solicitud);
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
	gbxFiltrar.setLayout(new qx.ui.layout.Grow());
	this.add(gbxFiltrar, {left: 0, top: 0, right: "78%"});
	
	
	var form = new qx.ui.form.Form();
	

	//gbxFiltrar.add(new qx.ui.basic.Label("Desde:"), {row: 0, column: 0});
	
	var dtfDesde = new qx.ui.form.DateField();
	dtfDesde.setMaxWidth(100);
	form.add(dtfDesde, "Desde", null, "fecha_desde", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 2}});
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Hasta:"), {row: 1, column: 0});
	
	var dtfHasta = new qx.ui.form.DateField();
	dtfHasta.setMaxWidth(100);
	form.add(dtfHasta, "Hasta", null, "fecha_hasta", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 2}});
	
	
	var aux = new Date;
	dtfHasta.setValue(aux);
	aux.setMonth(aux.getMonth() - 1);
	dtfDesde.setValue(aux);
	
	

	
	//gbxFiltrar.add(new qx.ui.basic.Label("Paciente:"), {row: 2, column: 0});
	
	var cboPaciente = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersona"});
	//cboPrestador.setWidth(400);
	
	var lstPaciente = cboPaciente.getChildControl("list");
	lstPaciente.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	form.add(cboPaciente, "Paciente", null, "persona_id", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 4}});
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Ef.público:"), {row: 3, column: 0});
	
	var cboEPublico = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarEfector"});

	var lstEPublico = cboEPublico.getChildControl("list");
	lstEPublico.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	//form.add(cboEPublico, "Ef.público", null, "id_efector_publico", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 4}});
	
	
	var slbTipoProducto = new qx.ui.form.SelectBox();
	
	var rpc = new farmacia.comp.rpc.Rpc("services/", "comp.M_Parametros");
	try {
		var resultado = rpc.callSync("autocompletarTipoProducto", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	slbTipoProducto.add(new qx.ui.form.ListItem("-", null, ""));
	for (var x in resultado) {
		slbTipoProducto.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	form.add(slbTipoProducto, "Tipo prod.", null, "id_m_tipo_producto", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 4}});
	
	
	var cboVademecum = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.M_Parametros", methodName: "autocompletarVademecum"});
	var lstVademecum = cboVademecum.getChildControl("list");
	form.add(cboVademecum, "Vademecum", null, "id_m_vademecum", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 4}});
	
	
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Médico:"), {row: 5, column: 0});
	
	var cboPersonal = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersonal"});
	//cboPrestador.setWidth(400);
	
	var lstPersonal = cboPersonal.getChildControl("list");
	lstPersonal.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	form.add(cboPersonal, "Médico", null, "id_personal", null, {grupo: 1, item: {row: 5, column: 1, colSpan: 4}});
	
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Estado:"), {row: 6, column: 0});
	
	var slbEstado = new qx.ui.form.SelectBox();
	slbEstado.add(new qx.ui.form.ListItem("-", null, ""));
	slbEstado.add(new qx.ui.form.ListItem("Emitida Hospital", null, "EH"));
	slbEstado.add(new qx.ui.form.ListItem("Autorizada Ser.Soc.Min.", null, "AS"));
	slbEstado.add(new qx.ui.form.ListItem("Denegada Ser.Soc.Min.", null, "DS"));
	slbEstado.add(new qx.ui.form.ListItem("Autorizada Aud.Med.Min.", null, "AA"));
	slbEstado.add(new qx.ui.form.ListItem("Denegada Aud.Med.Min.", null, "DA"));
	slbEstado.add(new qx.ui.form.ListItem("Entregada Farmacia", null, "EF"));
	slbEstado.add(new qx.ui.form.ListItem("Denegada Farmacia", null, "DF"));
	
	
	
	form.add(slbEstado, "Estado", null, "estado", null, {grupo: 1, item: {row: 6, column: 1, colSpan: 2}});
	
	
	
	var btnInicializar = new qx.ui.form.Button("Inicializar");
	btnInicializar.addListener("execute", function(e){
		var aux = new Date;
		dtfHasta.setValue(aux);
		aux.setMonth(aux.getMonth() - 1);
		dtfDesde.setValue(aux);
		
		lstEPublico.removeAll();
		cboEPublico.setValue("");
		
		lstPaciente.removeAll();
		cboPaciente.setValue("");
		
		lstPersonal.removeAll();
		cboPersonal.setValue("");
		
		slbEstado.setSelection([slbEstado.getChildren()[0]]);
		
		dtfDesde.focus();
	})
	form.addButton(btnInicializar, {grupo: 1, item: {row: 7, column: 2}});
	

	
	var btnFiltrar = new qx.ui.form.Button("Filtrar");
	btnFiltrar.addListener("execute", function(e){
		functionActualizarSolicitud();
	})
	form.addButton(btnFiltrar, {grupo: 1, item: {row: 7, column: 3}});
	
	
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 8, 5, 1);
	var l = formView._getLayout();
	l.setColumnFlex(1, 1);
	l.setColumnFlex(2, 1);
	l.setColumnFlex(3, 1);
	l.setColumnFlex(4, 1);
	
	gbxFiltrar.add(formView);
	
	
	
	
	
	// Menu
	
	var btnAutorizar = new qx.ui.menu.Button("Autorizar...");
	btnAutorizar.setEnabled(false);
	btnAutorizar.addListener("execute", function(e){
		btnFiltrar.focus();
		
		window.setTimeout(function(){
			(new dialog.Confirm({
			        "message"   : "Desea autorizar la solicitud seleccionada?",
			        "callback"  : function(e){
		        					if (e) {
		        						window.setTimeout(function(){
			        						var rpc = new farmacia.comp.rpc.Rpc("services/", "comp.M_Solicitudes");
			
			        						var data = tableModelPrestacion.getDataAsMapArray();
			        						
											for (var x in data) {
												var p = {};
												p.id_m_solicitud_item = data[x].id_m_solicitud_item;
												p.estado = "PE";
												
												try {
													var resultado = rpc.callSync("escribir_prestacion", p);
												} catch (ex) {
													alert("Sync exception: " + ex);
												}
											}
			        						
											var p = {};
											p.id_m_solicitud = rowDataSolicitud.id_m_solicitud;
											p.observaciones_bloqueo = "";
											p.estado = "AA";
											
											//var rpc = new farmacia.comp.rpc.Rpc("services/", "comp.M_Solicitudes");
											rpc.mostrar = false;
											rpc.addListener("completed", function(e){
												var data = e.getData();
												
												//alert(qx.lang.Json.stringify(data, null, 2));
												
												functionActualizarSolicitud(rowDataSolicitud.id_m_solicitud);
												
											});
			
											rpc.callAsyncListeners(true, "escribir_solicitud", p);
										}, 1);
		        					}
			        			},
			        "context"   : this,
			        "image"     : "icon/48/status/dialog-warning.png"
			})).show();
		}, 1);
	});
	

	
	
	var btnWebServices = new qx.ui.menu.Button("consultar Web services...");
	btnWebServices.setEnabled(false);
	btnWebServices.addListener("execute", function(e){
		var win = new farmacia.comp.windowWebService(rowDataSolicitud.persona_dni);
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	//menuSolicitud.add(btnAutorizar);
	//menuSolicitud.addSeparator();
	menuSolicitud.add(btnWebServices);
	menuSolicitud.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Paciente", "DNI", "Fecha", "Efector público", "Estado", "estado_condicion"], ["persona_nombre", "persona_dni", "fecha_emite", "efector_publico", "estado_descrip", "estado_condicion"]);
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
			
			tblPrestacion.setFocusedCell();
			
			tableModelPrestacion.setDataAsMapArray([], true);
			
			controllerFormInfoEntsal.resetModel();
			controllerFormInfoEntsal2.resetModel();
			
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "EH" || rowDataSolicitud.estado == "DA");
			btnWebServices.setEnabled(true);
			
			menuSolicitud.memorizar([btnAutorizar, btnWebServices]);
			
			
			btnEntregar.setEnabled(false);
			
			menuPrestacion.memorizar([btnEntregar]);
			
			
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
				p.id_m_solicitud = rowDataSolicitud.id_m_solicitud;
				
				this.rpc = new farmacia.comp.rpc.Rpc("services/", "comp.M_Solicitudes");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
					
					controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(rowDataSolicitud));
			
					tableModelPrestacion.setDataAsMapArray(data.result, true);
				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_solicitudes_prestaciones", p);
				
			}, null, this, null, 200);
		}
	});

	this.add(tblSolicitud, {left: "25%", top: 0, right: 0, bottom: "34%"});
	
	
	var container = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(container, {left: 0, top: 280, right: "76%", bottom: 0});
	
	var gbxOtros = new qx.ui.groupbox.GroupBox("Otros datos solicitud");
	gbxOtros.setLayout(new qx.ui.layout.Grow());
	container.add(gbxOtros, {left: 0, top: 0, right: 0, bottom: "50%"});
	
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
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Tratamiento realizado", null, "tratamiento_realizado");
	
	
	
	var controllerFormInfoEntsal = new qx.data.controller.Form(null, formInfoEntsal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal = new qx.ui.form.renderer.Single(formInfoEntsal);

	containerScroll.add(formViewEntsal);
	
	
	
	
	
	
	
	
	
	
	// Menu
	
	var btnEntregar = new qx.ui.menu.Button("Entregar...");
	btnEntregar.setEnabled(false);
	btnEntregar.addListener("execute", function(e){
		var win = new farmacia.comp.windowEntregar(rowDataPrestacion.cantidad_pedida - rowDataPrestacion.cantidad_entregada);
		win.setCaption("Entregar item");
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			window.setTimeout(function(){
				
				var p = {};
				p.id_m_solicitud = rowDataSolicitud.id_m_solicitud;
				p.id_m_solicitud_item = rowDataPrestacion.id_m_solicitud_item;
				p.cantidad_pedida = rowDataPrestacion.cantidad_pedida;
				p.cantidad_entregada = rowDataPrestacion.cantidad_entregada;
				p.cantidad = data;
				
				var rpc = new farmacia.comp.rpc.Rpc("services/", "comp.M_Solicitudes");
				rpc.mostrar = false;
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
					
					functionActualizarSolicitud(rowDataSolicitud.id_m_solicitud);
					
				});

				rpc.callAsyncListeners(true, "entregar_item", p);
			}, 1);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var menuPrestacion = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrestacion.add(btnEntregar);
	menuPrestacion.memorizar();	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Descripción", "Tipo", "Precio", "Presentación", "Forma", "Unidad", "Dosis dia.", "Dur.trat.", "Cant.ped.", "Cant.ent.", "Estado", "estado_condicion"], ["codigo_heredado", "descripcion", "tipo_producto_descripcion", "precio", "presentacion", "forma_farmaceutica", "unidades_descripcion", "dosis_diaria", "duracion_tratamiento", "cantidad_pedida", "cantidad_entregada", "estado_descrip", "estado_condicion"]);
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
	tblPrestacion.setContextMenu(menuPrestacion);
	
	var tableColumnModelPrestacion = tblPrestacion.getTableColumnModel();
	tableColumnModelPrestacion.setColumnVisible(12, false);
	
	var resizeBehaviorPrestacion = tableColumnModelPrestacion.getBehavior();

	//resizeBehaviorPrestacion.set(0, {width:"30%", minWidth:100});
	//resizeBehaviorPrestacion.set(1, {width:"70%", minWidth:100});
	//resizeBehaviorPrestacion.set(2, {width:"60%", minWidth:100});
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelPrestacion.setDataCellRenderer(3, cellrendererNumber);
	
	
	var cellrendererString = new qx.ui.table.cellrenderer.String();
	cellrendererString.addNumericCondition("==", 1, null, "#FF8000", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 2, null, "#119900", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 3, null, "#FF0000", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 4, null, "#0000FF", null, null, "estado_condicion");
	tableColumnModelPrestacion.setDataCellRenderer(11, cellrendererString);

	
	var selectionModelPrestacion = tblPrestacion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){
		if (selectionModelPrestacion.isSelectionEmpty()) {

		} else {

			rowDataPrestacion = tableModelPrestacion.getRowDataAsMap(tblPrestacion.getFocusedRow());

			controllerFormInfoEntsal2.setModel(qx.data.marshal.Json.createModel(rowDataPrestacion));

			btnEntregar.setEnabled((rowDataSolicitud.estado == "AA" || rowDataSolicitud.estado == "EF") && (rowDataPrestacion.estado == "PE" || rowDataPrestacion.estado == "EI"));

			menuPrestacion.memorizar([btnEntregar]);
		}
	});

	this.add(tblPrestacion, {left: "25%", top: "67%", right: 0, bottom: 0});

	
	
	
	
	var gbxOtros2 = new qx.ui.groupbox.GroupBox("Otros datos medicamento");
	gbxOtros2.setLayout(new qx.ui.layout.Grow());
	container.add(gbxOtros2, {left: 0, top: "50%", right: 0, bottom: 0});
	
	var containerScroll2 = new qx.ui.container.Scroll();
	gbxOtros2.add(containerScroll2);
	
	
	var formInfoEntsal2 = new qx.ui.form.Form();
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal2.add(aux, "Obs.pres.", null, "observacion_prescripcion");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal2.add(aux, "Obs.ent.", null, "observacion_entrega");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal2.add(aux, "Crónico", null, "cronico");

	
	var controllerFormInfoEntsal2 = new qx.data.controller.Form(null, formInfoEntsal2);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal2 = new qx.ui.form.renderer.Single(formInfoEntsal2);

	containerScroll2.add(formViewEntsal2);
	
	
	
		
	},
	members : 
	{

	}
});