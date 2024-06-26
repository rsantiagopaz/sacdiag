qx.Class.define("sacdiag.comp.pagePanelDeEstudiosEnProceso",
{
	extend : qx.ui.tabview.Page,
	construct : function (rowData)
	{
	this.base(arguments);

	this.setLabel('Panel de Estudios en Proceso');
	if (rowData) this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		if (rowData) {
			var aux;
			
			aux = rowData.fecha_emite;
			aux = new Date(aux.getFullYear(), aux.getMonth(), aux.getDate());
			dtfHasta.setValue(aux);
			aux.setMonth(aux.getMonth() - 6);
			dtfDesde.setValue(aux);
			
			aux = rowData.persona_nombre + " (" + rowData.persona_dni + ")";
			
			this.setLabel("historial " + aux);
			
			aux = new qx.ui.form.ListItem(aux, null, rowData.persona_id);
			lstPaciente.add(aux);
			lstPaciente.setSelection([aux]);
			
			cboEPublico.setVisibility("excluded");
			cboPrestador.setVisibility("excluded");
			cboPersonal.setVisibility("excluded");
			slbEstado.setVisibility("excluded");
			btnInicializar.setVisibility("excluded");
			btnFiltrar.setVisibility("excluded");
			
			dtfDesde.getChildControl("textfield").setReadOnly(true);
			dtfDesde.getChildControl("button").setEnabled(false);
			
			dtfHasta.getChildControl("textfield").setReadOnly(true);
			dtfHasta.getChildControl("button").setEnabled(false);
			
			cboPaciente.getChildControl("textfield").setReadOnly(true);
			cboPaciente.getChildControl("button").setEnabled(false);
			
			tblSolicitud.focus();
		} else {
			dtfDesde.focus();
		}
		
		btnFiltrar.execute();
	}, this);
	
	
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
		
		btnCambiarPrestador.setEnabled(false);
		btnAutorizar.setEnabled(false);
		btnBloquear.setEnabled(false);
		btnEliminar.setEnabled(false);
		btnWebServices.setEnabled(false);
		btnHistorial.setEnabled(false);
		menuSolicitud.memorizar([btnCambiarPrestador, btnAutorizar, btnBloquear, btnEliminar, btnWebServices, btnHistorial]);
		
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
			if (! lstEPublico.isSelectionEmpty()) p.id_efector_publico = lstEPublico.getSelection()[0].getModel();
			if (! lstPaciente.isSelectionEmpty()) p.persona_id = lstPaciente.getSelection()[0].getModel();
			if (! lstPersonal.isSelectionEmpty()) p.id_usuario_medico = lstPersonal.getSelection()[0].getModel();
			p.estado = slbEstado.getSelection()[0].getModel();
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
			this.rpc.setTimeout(20000);
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
	form.add(cboEPublico, "Ef.público", null, "id_efector_publico", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 4}});
	
	
	
	//gbxFiltrar.add(new qx.ui.basic.Label("Prestador:"), {row: 4, column: 0});
	
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
	rpc.callAsyncListeners(true, "autocompletarPrestador", {texto: "", prestador_tipo: "acd"});
	
	
	//var cboPrestador = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestador"});
	//cboPrestador.setWidth(400);
	
	var lstPrestador = cboPrestador.getChildControl("list");

	form.add(cboPrestador, "Prestador", null, "id_prestador_fantasia", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 4}});
	
	
	
	
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
	slbEstado.add(new qx.ui.form.ListItem("Emitida", null, "E"));
	slbEstado.add(new qx.ui.form.ListItem("Aprobada", null, "A"));
	slbEstado.add(new qx.ui.form.ListItem("Bloqueada", null, "B"));
	slbEstado.add(new qx.ui.form.ListItem("Capturada", null, "C"));
	slbEstado.add(new qx.ui.form.ListItem("Liberada", null, "L"));
	slbEstado.add(new qx.ui.form.ListItem("Prefacturada", null, "F"));
	slbEstado.add(new qx.ui.form.ListItem("para Pago", null, "P"));
	
	form.add(slbEstado, "Estado", null, "estado", null, {grupo: 1, item: {row: 6, column: 1, colSpan: 2}});
	
	
	
	var btnInicializar = new qx.ui.form.Button("Inicializar");
	btnInicializar.addListener("execute", function(e){
		var aux = new Date;
		dtfHasta.setValue(aux);
		aux.setMonth(aux.getMonth() - 1);
		dtfDesde.setValue(aux);
		
		cboPrestador.setSelection([cboPrestador.getChildren()[0]]);
		
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
	
	var btnCambiarPrestador = new qx.ui.menu.Button("Cambiar prestador...");
	btnCambiarPrestador.setEnabled(false);
	btnCambiarPrestador.addListener("execute", function(e){
		var win = new sacdiag.comp.windowSeleccionarPrestador('acd');
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			rowDataSolicitud.id_prestador_fantasia = data;
			
			var p = rowDataSolicitud;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
			});
			rpc.callAsyncListeners(true, "escribir_solicitud", p);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAutorizar = new qx.ui.menu.Button("Aprobar...");
	btnAutorizar.setEnabled(false);
	btnAutorizar.addListener("execute", function(e){
		tblSolicitud.blur();
		
		var win = new sacdiag.comp.windowObservar();
		win.setCaption("Aprobar solicitud");
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			tblSolicitud.setFocusedCell();
			
			var p = {};
			p.id_solicitud = rowDataSolicitud.id_solicitud;
			p.estado = rowDataSolicitud.estado;
			p.observaciones_aprueba = data;
			
			var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			});
			rpc.callAsyncListeners(true, "aprobar_solicitud", p);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnBloquear = new qx.ui.menu.Button("Bloquear...");
	btnBloquear.setEnabled(false);
	btnBloquear.addListener("execute", function(e){
		tblSolicitud.blur();
		
		if (rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A") {
			
			var win = new sacdiag.comp.windowObservar();
			win.setCaption("Bloquear solicitud");
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
				
				tblSolicitud.setFocusedCell();
				
				var p = {};
				p.id_solicitud = rowDataSolicitud.id_solicitud;
				p.estado = rowDataSolicitud.estado;
				p.observaciones_bloqueo = data;
				
				var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
				});
				rpc.callAsyncListeners(true, "bloquear_solicitud", p);
			});
			
			application.getRoot().add(win);
			win.center();
			win.open();
		} else {
			
			(new dialog.Confirm({
			        "message"   : "Desea desbloquear el item de solicitud seleccionado?",
			        "callback"  : function(e){
									if (e) {
										var p = {};
										p.id_solicitud = rowDataSolicitud.id_solicitud;
										
										tblSolicitud.setFocusedCell();
										
										var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
										rpc.addListener("completed", function(e){
											var data = e.getData();
											
											functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
										});
										rpc.callAsyncListeners(true, "desbloquear_solicitud", p);
		        					}
			        			},
			        "context"   : this,
			        "image"     : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar...");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		(new dialog.Confirm({
				"message"   : "Desea eliminar la solicitud seleccionada?",
				"callback"  : function(e){
								if (e) {
									tblSolicitud.blur();
									
									var p = {};
									p.id_solicitud = rowDataSolicitud.id_solicitud;
									p.estado = rowDataSolicitud.estado;
									
									var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
									rpc.addListener("completed", function(e){
										var data = e.getData();
										
										//alert(qx.lang.Json.stringify(data, null, 2));
										
										functionActualizarSolicitud(rowDataSolicitud.id_solicitud);
									});
									rpc.addListener("failed", function(e){
										var data = e.getData();
										
										//alert(qx.lang.Json.stringify(data, null, 2));
									});
									rpc.callAsyncListeners(true, "eliminar_solicitud", p);
								}
							},
				"context"   : this,
				"image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	
	
	var btnWebServices = new qx.ui.menu.Button("consultar Web services...");
	btnWebServices.addListener("execute", function(e){
		var sexos = {'F': 1, 'M': 2};
		var sexo = sexos[rowDataSolicitud.persona_sexo] ? sexos[rowDataSolicitud.persona_sexo] : 3;
		var win = new sacdiag.comp.windowWebService(rowDataSolicitud.persona_dni, sexo);
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnHistorial = new qx.ui.menu.Button("consultar historial (6 meses)...");
	btnHistorial.addListener("execute", function(e){
		var aux = new sacdiag.comp.pagePanelDeEstudiosEnProceso(rowDataSolicitud);
		application.tabviewMain.add(aux);
		application.tabviewMain.setSelection([aux]);
	});
	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	menuSolicitud.add(btnCambiarPrestador);
	menuSolicitud.add(btnAutorizar);
	menuSolicitud.add(btnBloquear);
	menuSolicitud.addSeparator();
	menuSolicitud.add(btnEliminar);
	menuSolicitud.addSeparator();
	menuSolicitud.add(btnWebServices);
	menuSolicitud.add(btnHistorial);
	menuSolicitud.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Id", "Paciente", "DNI", "Fecha", "Efector público", "Prestador", "Estado", "estado_condicion"], ["id_solicitud", "persona_nombre", "persona_dni", "fecha_emite", "efector_publico", "prestador", "estado_descrip", "estado_condicion"]);
	tableModelSolicitud.setColumnSortable(0, false);
	tableModelSolicitud.setColumnSortable(1, false);
	tableModelSolicitud.setColumnSortable(2, false);
	tableModelSolicitud.setColumnSortable(3, false);
	tableModelSolicitud.setColumnSortable(4, false);
	tableModelSolicitud.setColumnSortable(5, false);
	tableModelSolicitud.setColumnSortable(6, false);
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
	if (! rowData) tblSolicitud.setContextMenu(menuSolicitud);

	
	var tableColumnModelSolicitud = tblSolicitud.getTableColumnModel();
	tableColumnModelSolicitud.setColumnVisible(7, false);
	
	var resizeBehaviorSolicitud = tableColumnModelSolicitud.getBehavior();
	
	resizeBehaviorSolicitud.set(0, {width:"5%", minWidth:100});
	resizeBehaviorSolicitud.set(1, {width:"24%", minWidth:100});
	resizeBehaviorSolicitud.set(2, {width:"8%", minWidth:100});
	resizeBehaviorSolicitud.set(3, {width:"8%", minWidth:100});
	resizeBehaviorSolicitud.set(4, {width:"23%", minWidth:100});
	resizeBehaviorSolicitud.set(5, {width:"23%", minWidth:100});
	resizeBehaviorSolicitud.set(6, {width:"9%", minWidth:100});

	

	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModelSolicitud.setDataCellRenderer(3, cellrendererDate);
	

	var cellrendererString = new qx.ui.table.cellrenderer.String();
	cellrendererString.addNumericCondition("==", 1, null, "#FF8000", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 2, null, "#119900", null, null, "estado_condicion");
	cellrendererString.addNumericCondition("==", 3, null, "#FF0000", null, null, "estado_condicion");
	tableColumnModelSolicitud.setDataCellRenderer(6, cellrendererString);
	
	
	
	
	
	var selectionModelSolicitud = tblSolicitud.getSelectionModel();
	selectionModelSolicitud.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSolicitud.addListener("changeSelection", function(e){
		if (selectionModelSolicitud.isSelectionEmpty()) {

		} else {
			
			rowDataSolicitud = tableModelSolicitud.getRowDataAsMap(tblSolicitud.getFocusedRow());
			
			tableModelPrestacion.setDataAsMapArray([], true);
			
			//controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(rowDataSolicitud));
			controllerFormInfoEntsal.resetModel();
			
			btnCambiarPrestador.setEnabled(rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "E");
			btnBloquear.setEnabled(rowDataSolicitud.estado == "B" || rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			btnBloquear.setLabel((rowDataSolicitud.estado == "B") ? "Desbloquear" : "Bloquear...")
			btnEliminar.setEnabled(rowDataSolicitud.estado == "L");
			btnWebServices.setEnabled(true);
			btnHistorial.setEnabled(true);
			
			menuSolicitud.memorizar([btnCambiarPrestador, btnAutorizar, btnBloquear, btnEliminar, btnWebServices, btnHistorial]);
			
			
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
				p.id_solicitud = rowDataSolicitud.id_solicitud;
				
				this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
					
					controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(data.result.solicitud));
			
					tableModelPrestacion.setDataAsMapArray(data.result.prestacion, true);
				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_solicitudes_prestaciones", p);
				
			}, null, this, null, 200);
		}
	});

	this.add(tblSolicitud, {left: "23%", top: 0, right: 0, bottom: "50%"});
	
	
	
	
	var gbxOtros = new qx.ui.groupbox.GroupBox("Otros datos");
	gbxOtros.setLayout(new qx.ui.layout.Grow());
	this.add(gbxOtros, {left: 0, top: "53%", right: "50%", bottom: 0});
	
	var containerScroll = new qx.ui.container.Scroll();
	gbxOtros.add(containerScroll);
	
	
	var formInfoEntsal = new qx.ui.form.Form();
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Obs.bloqueo", null, "observaciones_bloqueo");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Obs.aprob.", null, "observaciones_aprueba");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Observaciones", null, "observaciones");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Info.clínica", null, "informacion_clinica");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Cert.neg.ANSES", null, "anses_negativa");
	
	var aux = new qx.ui.form.TextField("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Médico", null, "medico_descrip");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	//formInfoEntsal.add(aux, "Orient.diagnóstica", null, "orientacion_diagnostica");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	//formInfoEntsal.add(aux, "Servicio", null, "servicio");
	
	var aux = new qx.ui.form.TextArea("");
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	//formInfoEntsal.add(aux, "Habitación cama", null, "habitacion_cama");
	
	var controllerFormInfoEntsal = new qx.data.controller.Form(null, formInfoEntsal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal = new qx.ui.form.renderer.Double(formInfoEntsal);
	
	
	containerScroll.add(formViewEntsal, {left: 0, top: 0});
	
	
	
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Cantidad", "Descripción"], ["codigo", "cantidad", "denominacion"]);
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

	resizeBehaviorPrestacion.set(0, {width:"20%", minWidth:100});
	resizeBehaviorPrestacion.set(1, {width:"10%", minWidth:100});
	resizeBehaviorPrestacion.set(2, {width:"70%", minWidth:100});

	
	
	var selectionModelPrestacion = tblPrestacion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){

	});

	this.add(tblPrestacion, {left: "51%", top: "52%", right: 0, bottom: 0});

	
	
	
	
	tblSolicitud.setTabIndex(11);
	tblPrestacion.setTabIndex(12);
	
	
		
	},
	members : 
	{

	}
});