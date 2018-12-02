qx.Class.define("servicio_social.comp.pageFormularioDeDatos",
{
	extend : qx.ui.tabview.Page,
	construct : function (rowData)
	{
	this.base(arguments);

	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Grow());
	
	this.addListenerOnce("appear", function(e){
		cboPaciente.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;

	
	var composite1 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	
	var composite2 = new qx.ui.container.Scroll(composite1);
	this.add(composite2);
	
	
	
	//var composite1 = new qx.ui.container.Composite(new qx.ui.layout.VBox());
	//this.add(composite1, {left: 0, top: 0})
	
	var gbx1 = new qx.ui.groupbox.GroupBox(" Solicitud ");
	gbx1.setLayout(new qx.ui.layout.Canvas());
	composite1.add(gbx1, {left: 0, top: 0});
	
	
	var form1 = new qx.ui.form.Form();
	
	var cboPaciente = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersona"});
	cboPaciente.setRequired(true);
	cboPaciente.setMaxHeight(23);
	form1.add(cboPaciente, "Paciente", null, "cboPaciente", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 17}});
	cboPaciente.getChildControl("popup").addListener("disappear", function(e){
		/*
		if (! lstPaciente.isSelectionEmpty()) {
			var datos = lstPaciente.getSelection()[0].getUserData("datos");
			
			var p = {};
			p.persona_id = datos.model;
			p.persona_dni = datos.persona_dni;
			
			var rpc = new servicio_social.comp.rpc.Rpc("services/", "comp.Puco");
			rpc.mostrar = false;
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
				
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
			}, this);
			rpc.callAsyncListeners(true, "getPuco", p);
		}
		*/
	});
	
	var lstPaciente = cboPaciente.getChildControl("list");
	lstPaciente.addListener("changeSelection", function(e){
		btnWS.setEnabled(! lstPaciente.isSelectionEmpty());
	});
	form1.add(lstPaciente, "", null, "persona_id_paciente");
	
	var btnWS = new qx.ui.form.Button("consultar Web services...");
	btnWS.setEnabled(false);
	btnWS.addListener("execute", function(e){
		var datos = lstPaciente.getSelection()[0].getUserData("datos");
		
		var win = new servicio_social.comp.windowWebService(datos.persona_dni);
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	form1.addButton(btnWS, {grupo: 1, tabIndex: 1, item: {row: 0, column: 18}});
	
	var cboPersonal = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPersonal"});
	cboPersonal.setRequired(true);
	form1.add(cboPersonal, "Médico", null, "cboPersonal", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 17}});
	
	var lstPersonal = cboPersonal.getChildControl("list");
	form1.add(lstPersonal, "", null, "id_personal_medico");
	
	var txtInformacion_clinica = new qx.ui.form.TextArea();
	form1.add(txtInformacion_clinica, "Info.clínica", null, "informacion_clinica", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 6}});
	
	var txtOrientacion_diagnostica = new qx.ui.form.TextArea();
	form1.add(txtOrientacion_diagnostica, "Orientacion diagnostica", null, "orientacion_diagnostica", null, {grupo: 1, item: {row: 2, column: 8, colSpan: 6}});
	
	var txtObservaciones = new qx.ui.form.TextArea();
	form1.add(txtObservaciones, "Observaciones", null, "observaciones", null, {grupo: 1, item: {row: 2, column: 15, colSpan: 13}});
	
	var cboDiagnostico = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarCie10"});
	cboDiagnostico.setRequired(true);
	form1.add(cboDiagnostico, "Diagnóstico CIE-10", null, "cboDiagnostico", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 27}});
	
	var lstDiagnostico = cboDiagnostico.getChildControl("list");
	form1.add(lstDiagnostico, "", null, "id_diagnostico");
	
	var txtExamen_complementario = new qx.ui.form.TextArea();
	form1.add(txtExamen_complementario, "Ex.complementario", null, "examen_complementario", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 6}});
	
	var txtExamen_radiologico = new qx.ui.form.TextArea();
	form1.add(txtExamen_radiologico, "Ex.radiologico", null, "examen_radiologico", null, {grupo: 1, item: {row: 4, column: 8, colSpan: 6}});
	
	var txtExamen_otros = new qx.ui.form.TextArea();
	form1.add(txtExamen_otros, "Ex.otros", null, "examen_otros", null, {grupo: 1, item: {row: 4, column: 15, colSpan: 6}});
	
	var txtExamen_otro_centro = new qx.ui.form.TextArea();
	form1.add(txtExamen_otro_centro, "Ex.otro centro", null, "examen_otro_centro", null, {grupo: 1, item: {row: 4, column: 22, colSpan: 6}});
	
	var txtTratamiento_realizado = new qx.ui.form.TextArea();
	form1.add(txtTratamiento_realizado, "Tratamiento realizado", null, "tratamiento_realizado", null, {grupo: 1, item: {row: 5, column: 1, colSpan: 6}});
	
	var txtFundamentacion = new qx.ui.form.TextArea();
	form1.add(txtFundamentacion, "Fundamentacion", null, "fundamentacion", null, {grupo: 1, item: {row: 5, column: 8, colSpan: 6}});
	
	var txtInternacion_servicio = new qx.ui.form.TextArea();
	form1.add(txtInternacion_servicio, "Servicio", null, "internacion_servicio", null, {grupo: 1, item: {row: 5, column: 15, colSpan: 6}});
	
	var txtInternacion_cama = new qx.ui.form.TextArea();
	form1.add(txtInternacion_cama, "Cama", null, "internacion_cama", null, {grupo: 1, item: {row: 5, column: 22, colSpan: 6}});
	
	
	
	var controllerForm1 = new qx.data.controller.Form(null, form1);
	//controllerForm1.createModel(true);
	
	//var formView1 = new qx.ui.form.renderer.Double(form1);
	var formView1 = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 12, 40, 1);
	gbx1.add(formView1, {left: 0, top: 0});
	
	
	
	
	var gbx2 = new qx.ui.groupbox.GroupBox(" Items ");
	gbx2.setLayout(new qx.ui.layout.Canvas());
	composite1.add(gbx2, {left: 0, top: 360});
	
	
	
	
	

	
	
	
	
	// Menu

	
	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new servicio_social.comp.windowPrestacion();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			tableModel.addRowsAsMapArray([data], null, true);
			tbl.setFocusedCell(0, tableModel.getRowCount() - 1, true);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAgregar = new qx.ui.menu.Button("Agregar...", null, commandAgregar);
	
	
	var commandEliminar = new qx.ui.command.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e){
		tableModel.removeRows(tbl.getFocusedRow(), 1);
	});
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar", null, commandEliminar);
	
	
	var menuItems = new componente.comp.ui.ramon.menu.Menu();
	
	menuItems.add(btnAgregar);
	menuItems.add(btnEliminar);
	menuItems.memorizar();
	
	
	
	
	

	
	
	
	
	// Tabla
	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["Prestación", "Establecimiento", "F.turno", "Estudios", "Acompañantes", "Dias", "Monto"], ["prestacion", "establecimiento", "f_turno", "estudios_a_realizar", "cant_acompanantes", "cant_dias", "monto_presup"]);
	
	tableModel.addListener("dataChanged", function(e){
		var rowCount = tableModel.getRowCount();
		
		tbl.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, {
		tableColumnModel: function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}
	});
	tbl.setShowCellFocusIndicator(false);
	tbl.toggleColumnVisibilityButtonVisible();
	tbl.setHeight(150);
	tbl.setWidth(1035);
	tbl.setContextMenu(menuItems);
	
	var tableColumnModel = tbl.getTableColumnModel();
	
	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModel.setDataCellRenderer(2, cellrendererDate);
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModel.setDataCellRenderer(6, cellrendererNumber);
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(e){
		if (! selectionModel.isSelectionEmpty()) {
			commandEliminar.setEnabled(true);
		} else {
			commandEliminar.setEnabled(false);
		}
		
		menuItems.memorizar([commandEliminar]);
	});
	
	
	gbx2.add(tbl, {left: 0, top: 0});

	
	
	
	var btnAceptar = new qx.ui.form.Button("Grabar solicitud");
	btnAceptar.addListener("execute", function(e){
		if (form1.validate()) {
			if (tableModel.getRowCount() > 0) {
				(new dialog.Confirm({
				        "message"   : "Desea grabar la solicitud de traslado y/o alojamiento?",
				        "callback"  : function(e){
							if (e) {
								var p = {};
								p.ta_solicitud = qx.util.Serializer.toNativeObject(controllerForm1.getModel());
								p.ta_solicitud_item = qx.util.Serializer.toNativeObject(tableModel.getDataAsMapArray());

								//alert(qx.lang.Json.stringify(p, null, 2));

								var rpc = new servicio_social.comp.rpc.Rpc("services/", "comp.Solicitudes");
								rpc.addListener("completed", function(e){
									var data = e.getData();

									this.fireDataEvent("aceptado", data.result);

									if (rowData == null) {
										application.tabviewMain.remove(application.pagesMain.pageAlta);
										application.pagesMain.pageAlta = null;
									} else {
										application.tabviewMain.remove(application.pagesMain["id" + rowData.id_ta_solicitud]);
										application.pagesMain["id" + rowData.id_ta_solicitud] = null;
									}
								}, this);
								rpc.addListener("failed", function(e){
									var data = e.getData();

									alert(qx.lang.Json.stringify(data, null, 2));
								}, this);

								rpc.callAsyncListeners(true, "alta_modifica_solicitud", p);
							}
						},
				        "context"   : this,
				        "image"     : "icon/48/status/dialog-warning.png"
				})).show();				
			} else {
				dialog.Dialog.warning("Debe ingresar algun item", function(){
					tbl.focus();
				});
			}
		} else {
			form1.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	composite1.add(btnAceptar, {left: 50, top: 570});
	
	
	var btnInicializar2 = new qx.ui.form.Button("Inicializar solicitud");
	btnInicializar2.addListener("execute", function(e){
		form1.reset();
		tableModel.setDataAsMapArray([], true);
		
		cboPaciente.focus();
	});
	//composite1.add(btnInicializar2, {left: 200, top: 570});
	
	
	
	
	
	
	
	if (rowData == null) {
		this.setLabel("Nueva solicitud");
		
		aux = {};
		aux.id_ta_solicitud = "0";
		aux.cboPaciente = null;
		aux.persona_id_paciente = null;
		aux.cboPersonal = null;
		aux.id_personal_medico = null;
		aux.informacion_clinica = "";
		aux.orientacion_diagnostica = "";
		aux.observaciones = "";
		aux.cboDiagnostico = null;
		aux.id_diagnostico = null;
		aux.examen_complementario = "";
		aux.examen_radiologico = "";
		aux.examen_otros = "";
		aux.examen_otro_centro = "";
		aux.tratamiento_realizado = "";
		aux.fundamentacion = "";
		aux.internacion_servicio = "";
		aux.internacion_cama = "";
		
		aux = qx.data.marshal.Json.createModel(aux, true);
		
		controllerForm1.setModel(aux);
		
	} else {
		this.setLabel("Modificar solicitud");
		
		var p = {};
		p.id_ta_solicitud = rowData.id_ta_solicitud;
		
		var rpc = new servicio_social.comp.rpc.Rpc("services/", "comp.Solicitudes");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			var resultado = data.result;
			
			this.setLabel(resultado.cboPaciente.label);
			
			resultado.solicitud.cboPaciente = null;
			resultado.solicitud.cboPersonal = null;
			resultado.solicitud.cboDiagnostico = null;
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			var listItem;
			
			listItem = new qx.ui.form.ListItem(resultado.cboPaciente.label, null, resultado.cboPaciente.model);
			listItem.setUserData("datos", resultado.cboPaciente);
			cboPaciente.add(listItem);
			
			listItem = new qx.ui.form.ListItem(resultado.cboPersonal.label, null, resultado.cboPersonal.model);
			listItem.setUserData("datos", resultado.cboPersonal);
			cboPersonal.add(listItem);
			
			listItem = new qx.ui.form.ListItem(resultado.cboDiagnostico.label, null, resultado.cboDiagnostico.model);
			listItem.setUserData("datos", resultado.cboDiagnostico);
			cboDiagnostico.add(listItem);
			
			
			
			aux = qx.data.marshal.Json.createModel(resultado.solicitud, true);
			
			controllerForm1.setModel(aux);
			
			tableModel.setDataAsMapArray(resultado.items, true);
			
			cboPaciente.focus();
			
		}, this);
		
		rpc.callAsyncListeners(true, "leer_solicitud", p);
	}
	
	
	
	
	
	
	tbl.setTabIndex(25);
	
	btnAceptar.setTabIndex(26);
	btnInicializar2.setTabIndex(27);
	
	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});