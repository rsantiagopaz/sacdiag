qx.Class.define("sacdiag.comp.pageControlDePrefacturaciones",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Control de Prefacturaciones');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		//dtfDesde.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataSolicitud;
	var rowDataPrefac;
	
	
	
	
	var functionActualizarPrefac = function(id_prefacturacion) {
		
		tblPrefac.resetSelection();
		tblSolicitud.resetSelection();
		tblPrestacion.resetSelection();
		
		tblPrefac.setFocusedCell();
		tblSolicitud.setFocusedCell();
		tblPrestacion.setFocusedCell();
		
		btnObservarGral.setEnabled(false);
		btnVincular.setEnabled(false);
		menuPrefac.memorizar([btnObservarGral, btnVincular]);
		
		btnAutorizar.setEnabled(false);
		menuPrefac.memorizar([btnAutorizar]);
		
		btnObservar.setEnabled(false);
		menuSolicitud.memorizar([btnObservar]);
		
		tableModelSolicitud.setDataAsMapArray([], true);
		tableModelPrestacion.setDataAsMapArray([], true);
		
		txtObserva.setValue("");
		txtObservaGral.setValue("");
		
		
		
		var p = {};
		
		var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));

			tableModelPrefac.setDataAsMapArray(data.result, true);
			
			if (id_prefacturacion != null) {
				tblPrefac.blur();
				tblPrefac.buscar("id_prefacturacion", id_prefacturacion);
				tblPrefac.focus();
			}
		});
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			if (data.message != "sesion_terminada") {
				alert(qx.lang.Json.stringify(data, null, 2));
			}
		});
		rpc.callAsyncListeners(true, "leer_prefacturacion", p);
		
		return rpc;
	}
	

	
	
	
	
	
	
	// Menu
	
	
	var btnObservarGral = new qx.ui.menu.Button("Observar...");
	btnObservarGral.setEnabled(false);
	btnObservarGral.addListener("execute", function(e){
		if (rowDataPrefac.estado == "E") {
			var win = new sacdiag.comp.windowObservar();
			win.setCaption("Observar prefacturación");
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
				
				var p = {};
				p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
				p.observaciones = data;
				p.estado = "O";
				
				var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					functionActualizarPrefac(rowDataPrefac.id_prefacturacion);
				});
				rpc.callAsyncListeners(true, "escribir_prefacturacion", p);
			});
			
			application.getRoot().add(win);
			win.center();
			win.open();
		} else {
			(new dialog.Confirm({
			        "message"   : "Desea quitar la observacion de la prefacturación seleccionada?",
			        "callback"  : function(e){
		        					if (e) {
										var p = {};
										p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
										p.observaciones = "";
										p.estado = "E";
										
										var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
										rpc.addListener("completed", function(e){
											var data = e.getData();
											
											functionActualizarPrefac(rowDataPrefac.id_prefacturacion);
										});
										rpc.callAsyncListeners(true, "escribir_prefacturacion", p);
		        					}
			        			},
			        "context"   : this,
			        "image"     : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	
	
	var btnVincular = new qx.ui.menu.Button("Vincular asunto...");
	btnVincular.setEnabled(false);
	btnVincular.addListener("execute", function(e){
		var win = new sacdiag.comp.windowAsunto();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			var p = {};
			p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
			p.documentacion_id = data;
			
			var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				functionActualizarPrefac(rowDataPrefac.id_prefacturacion);
			});
			rpc.callAsyncListeners(true, "escribir_prefacturacion", p);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});

	
	var btnAutorizar = new qx.ui.menu.Button("Aprobar...");
	btnAutorizar.setEnabled(false);
	btnAutorizar.addListener("execute", function(e){
		(new dialog.Confirm({
		        "message"   : "Desea aprobar la prefacturacion seleccionada?",
		        "callback"  : function(e){
	        					if (e) {
									var p = {};
									p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
									p.estado = "A";
									
									var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
									rpc.addListener("completed", function(e){
										var data = e.getData();
										
										tblPrefac.blur();
										
										rowDataPrefac.estado = "A";
										tableModelPrefac.setRowsAsMapArray([rowDataPrefac], tblPrefac.getFocusedRow(), true);
										
										tblPrefac.focus();
									});
									rpc.callAsyncListeners(true, "escribir_prefacturacion", p);
	        					}
		        			},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	

	
	
	var menuPrefac = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrefac.add(btnObservarGral);
	menuPrefac.add(btnVincular);
	menuPrefac.addSeparator();
	menuPrefac.add(btnAutorizar);
	menuPrefac.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrefac = new qx.ui.table.model.Simple();
	tableModelPrefac.setColumns(["Fecha", "Prestador", "Asunto", "Cantidad", "Total", "Estado"], ["fecha_creacion", "nombre", "documentacion_id", "cantidad", "valor", "estado"]);
	tableModelPrefac.addListener("dataChanged", function(e){
		var rowCount = tableModelPrefac.getRowCount();
		
		tblPrefac.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPrefac = new componente.comp.ui.ramon.table.Table(tableModelPrefac, custom);
	tblPrefac.setShowCellFocusIndicator(false);
	tblPrefac.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblPrefac.setContextMenu(menuPrefac);

	
	var tableColumnModelPrefac = tblPrefac.getTableColumnModel();
	
	var resizeBehaviorPrefac = tableColumnModelPrefac.getBehavior();

	resizeBehaviorPrefac.set(0, {width:"12%", minWidth:100});
	resizeBehaviorPrefac.set(1, {width:"43%", minWidth:100});
	resizeBehaviorPrefac.set(2, {width:"12%", minWidth:100});
	resizeBehaviorPrefac.set(3, {width:"10%", minWidth:100});
	resizeBehaviorPrefac.set(4, {width:"12%", minWidth:100});
	resizeBehaviorPrefac.set(5, {width:"11%", minWidth:100});

	

	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModelPrefac.setDataCellRenderer(0, cellrendererDate);
	
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelPrefac.setDataCellRenderer(4, cellrendererNumber);
	
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"E" : "Emitida",
		"O" : "Observada",
		"A" : "Aprobada"
	});
	tableColumnModelPrefac.setDataCellRenderer(5, cellrendererReplace);
	
	
	var selectionModelPrefac = tblPrefac.getSelectionModel();
	selectionModelPrefac.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrefac.addListener("changeSelection", function(e){
		if (! selectionModelPrefac.isSelectionEmpty()) {
			
			rowDataPrefac = tableModelPrefac.getRowDataAsMap(tblPrefac.getFocusedRow());
			
			btnObservarGral.setLabel((rowDataPrefac.estado == "O") ? "Quitar observación..." : "Observar...");
			
			//btnAutorizar.setEnabled(rowDataPrefac.estado == "E");
			btnAutorizar.setEnabled(false);
			
			/*
			commandVerPrestacion.setEnabled(true);
			btnCambiarPrestador.setEnabled(rowDataSolicitud.estado == "E" || rowDataSolicitud.estado == "A");
			btnAutorizar.setEnabled(rowDataSolicitud.estado == "E");
			btnBloquear.setEnabled(rowDataSolicitud.estado == "B" || rowDataSolicitud.estado == "A");
			btnBloquear.setLabel((rowDataSolicitud.estado == "B") ? "Desbloquear" : "Bloquear")
			
			menuPrefac.memorizar([commandVerPrestacion, btnCambiarPrestador, btnAutorizar, btnBloquear]);
			*/
			
			
			tblSolicitud.resetSelection();
			tblPrestacion.resetSelection();
			
			tblSolicitud.setFocusedCell();
			tblPrestacion.setFocusedCell();
			
			txtObservaGral.setValue(rowDataPrefac.observaciones);
			txtObserva.setValue("");
			
			btnVincular.setEnabled(rowDataPrefac.documentacion_id == null);
			btnObservarGral.setEnabled(rowDataPrefac.estado == "E" || rowDataPrefac.estado == "O");
			menuPrefac.memorizar([btnObservarGral, btnVincular]);
			
			btnObservar.setEnabled(false);
			menuSolicitud.memorizar([btnObservar]);
			
			tableModelSolicitud.setDataAsMapArray([], true);
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
				p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
				
				this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
			
					tableModelSolicitud.setDataAsMapArray(data.result, true);
					
					var bandera = true;
					for (var x in data.result) {
						if (data.result[x].prefacturaciones_items_estado == "O") bandera = false;
					}
					
					btnAutorizar.setEnabled(rowDataPrefac.estado == "E" && bandera);
					
					menuPrefac.memorizar([btnAutorizar]);

				});
				this.rpc.addListener("failed", function(e){
					var data = e.getData();
					
					if (data.message != "sesion_terminada") alert(qx.lang.Json.stringify(data, null, 2));
				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_solicitudes", p);
			
			}, null, this, null, 200);
		}
	});

	this.add(tblPrefac, {left: 0, top: 0, right: "51%", bottom: "11%"});
	
	
	
	var composite = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(composite, {left: 0, top: "90%", right: "51%", bottom: 0});
	
	composite.add(new qx.ui.basic.Label("Observaciones:"), {left: 0, top: 0});
	
	var txtObservaGral = new qx.ui.form.TextArea("");
	txtObservaGral.setReadOnly(true);
	txtObservaGral.setDecorator("main");
	txtObservaGral.setBackgroundColor("#ffffc0");
	composite.add(txtObservaGral, {left: 0, top: 17, right: 0, bottom: 0});
	
	
	
	
	
	
	
	
	
	
	
	// Menu

	
	var btnObservar = new qx.ui.menu.Button("Observar...");
	btnObservar.setEnabled(false);
	btnObservar.addListener("execute", function(e){
		if (rowDataSolicitud.prefacturaciones_items_estado == "F") {
			var win = new sacdiag.comp.windowObservar();
			win.setCaption("Observar item prefacturación");
			win.setModal(true);
			win.addListener("aceptado", function(e){
				var data = e.getData();
				
				tblSolicitud.resetSelection();
				tblPrestacion.resetSelection();
		
				tblSolicitud.setFocusedCell();
				tblPrestacion.setFocusedCell();
				
				var p = {};
				p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
				p.id_prefacturacion_item = rowDataSolicitud.id_prefacturacion_item;
				p.observaciones = data;
				p.prefacturaciones_items_estado = "O";
				
				var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					functionActualizarPrefac(rowDataPrefac.id_prefacturacion);
					
					/*
					rowDataPrefac.estado = data.result.estado;
					tableModelPrefac.setRowsAsMapArray([rowDataPrefac], tblPrefac.getFocusedRow(), true);
					
					rowDataSolicitud.observaciones = p.observaciones;
					rowDataSolicitud.prefacturaciones_items_estado = p.prefacturaciones_items_estado;
					
					tableModelSolicitud.setRowsAsMapArray([rowDataSolicitud], tblSolicitud.getFocusedRow(), true);
					tblSolicitud.blur();
					tblSolicitud.focus();
					*/
				});
				rpc.callAsyncListeners(true, "observar", p);
			});
			
			application.getRoot().add(win);
			win.center();
			win.open();
		} else {
			(new dialog.Confirm({
			        "message"   : "Desea quitar la observacion del item de prefacturación seleccionado?",
			        "callback"  : function(e){
		        					if (e) {
										tblSolicitud.resetSelection();
										tblPrestacion.resetSelection();
								
										tblSolicitud.setFocusedCell();
										tblPrestacion.setFocusedCell();
		        						
										var p = {};
										p.id_prefacturacion = rowDataPrefac.id_prefacturacion;
										p.id_prefacturacion_item = rowDataSolicitud.id_prefacturacion_item;
										p.observaciones = "";
										p.prefacturaciones_items_estado = "F";
										
										var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Prefacturacion");
										rpc.addListener("completed", function(e){
											var data = e.getData();
											
											functionActualizarPrefac(rowDataPrefac.id_prefacturacion);
											
											/*
											rowDataPrefac.estado = data.result.estado;
											tableModelPrefac.setRowsAsMapArray([rowDataPrefac], tblPrefac.getFocusedRow(), true);
											
											rowDataSolicitud.observaciones = p.observaciones;
											rowDataSolicitud.prefacturaciones_items_estado = p.prefacturaciones_items_estado;
											
											tableModelSolicitud.setRowsAsMapArray([rowDataSolicitud], tblSolicitud.getFocusedRow(), true);
											tblSolicitud.blur();
											tblSolicitud.focus();
											*/
										});
										rpc.callAsyncListeners(true, "observar", p);
		        					}
			        			},
			        "context"   : this,
			        "image"     : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	

	
	
	var menuSolicitud = new componente.comp.ui.ramon.menu.Menu();
	
	menuSolicitud.add(btnObservar);
	menuSolicitud.memorizar();
	
	
	
	
	
	//Tabla
	
	
	var tableModelSolicitud = new qx.ui.table.model.Simple();
	tableModelSolicitud.setColumns(["Paciente", "DNI", "Fecha", "Efector público", "Estado"], ["persona_nombre", "persona_dni", "fecha_emite", "efector_publico", "prefacturaciones_items_estado"]);
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
	
	var resizeBehaviorSolicitud = tableColumnModelSolicitud.getBehavior();

	resizeBehaviorSolicitud.set(0, {width:"32%", minWidth:100});
	resizeBehaviorSolicitud.set(1, {width:"12%", minWidth:100});
	resizeBehaviorSolicitud.set(2, {width:"12%", minWidth:100});
	resizeBehaviorSolicitud.set(3, {width:"32%", minWidth:100});
	resizeBehaviorSolicitud.set(4, {width:"12%", minWidth:100});
	

	var cellrendererDate = new qx.ui.table.cellrenderer.Date();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd"));
	tableColumnModelSolicitud.setDataCellRenderer(2, cellrendererDate);
	
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"O" : "Observada",
		"F" : "Facturada"
	});
	tableColumnModelSolicitud.setDataCellRenderer(4, cellrendererReplace);
	
	
	var selectionModelSolicitud = tblSolicitud.getSelectionModel();
	selectionModelSolicitud.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSolicitud.addListener("changeSelection", function(e){
		if (! selectionModelSolicitud.isSelectionEmpty()) {
			
			rowDataSolicitud = tableModelSolicitud.getRowDataAsMap(tblSolicitud.getFocusedRow());
			
			tblPrestacion.resetSelection();
			tblPrestacion.setFocusedCell();
			
			btnObservar.setLabel((rowDataSolicitud.prefacturaciones_items_estado == "F") ? "Observar..." : "Quitar observación...");
			
			btnObservar.setEnabled(rowDataPrefac.estado == "E" || rowDataPrefac.estado == "O");
			menuSolicitud.memorizar([btnObservar]);
			
			txtObserva.setValue(rowDataSolicitud.observaciones);
			
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
				p.id_solicitud = rowDataSolicitud.id_solicitud;
				
				this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Solicitudes");
				this.rpc.addListener("completed", function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));
			
					tableModelPrestacion.setDataAsMapArray(data.result, true);

				});
				this.rpc.addListener("failed", function(e){
					var data = e.getData();
					
					if (data.message != "sesion_terminada") alert(qx.lang.Json.stringify(data, null, 2));
				});
				
				this.opaqueCallRef = this.rpc.callAsyncListeners(false, "leer_solicitudes_prestaciones", p);
			
			}, null, this, null, 200);
		}
	});

	this.add(tblSolicitud, {left: "51%", top: 0, right: 0, bottom: "57%"});
	
	
	
	
	
	
	var composite = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(composite, {left: "51%", top: "44%", right: 0, bottom: "46%"});
	
	composite.add(new qx.ui.basic.Label("Observaciones:"), {left: 0, top: 0});
	
	var txtObserva = new qx.ui.form.TextArea("");
	txtObserva.setReadOnly(true);
	txtObserva.setDecorator("main");
	txtObserva.setBackgroundColor("#ffffc0");
	composite.add(txtObserva, {left: 0, top: 17, right: 0, bottom: 0});
	
	
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Descripción", "Valor", "Resultado"], ["codigo", "denominacion", "valor", "prestacion_resultado"]);
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

	resizeBehaviorPrestacion.set(0, {width:"18%", minWidth:100});
	resizeBehaviorPrestacion.set(1, {width:"46%", minWidth:100});
	resizeBehaviorPrestacion.set(2, {width:"18%", minWidth:100});
	resizeBehaviorPrestacion.set(3, {width:"18%", minWidth:100});
	
	
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelPrestacion.setDataCellRenderer(2, cellrendererNumber);

	
	
	var selectionModelPrestacion = tblPrestacion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){

	});

	this.add(tblPrestacion, {left: "51%", top: "56%", right: 0, bottom: 0});

	
	
	
	
	
	functionActualizarPrefac();
	
		
	},
	members : 
	{

	}
});