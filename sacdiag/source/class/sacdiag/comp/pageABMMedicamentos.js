qx.Class.define("sacdiag.comp.pageABMMedicamentos",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('ABM Medicamentos');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		//cboTitulo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataTipo_producto;
	var rowDataVademecum;
	
	
	
	var functionActualizarTipoMedicamento = function(id_m_tipo_producto) {
		tblTipo_producto.blur();
		tblTipo_producto.setFocusedCell();
		tblVademecum.setFocusedCell();
		
		commandAgregarVademecum.setEnabled(false);
		menuVademecum.memorizar([commandAgregarVademecum]);
		tableModelVademecum.setDataAsMapArray([], true);

		
		var p = {};
		
		var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.M_Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModelTipo_producto.setDataAsMapArray(data.result, true);
			
			if (id_m_tipo_producto != null) {
				tblTipo_producto.blur();
				tblTipo_producto.buscar("id_m_tipo_producto", id_m_tipo_producto);
				tblTipo_producto.focus();
			}
		});
		rpc.callAsyncListeners(true, "leer_tipo_producto", p);
		
		return rpc;
	}
	
	
	var functionActualizarVademecum = function(id_m_vademecum) {
		
		tableModelVademecum.setDataAsMapArray([], true);
		
		tblVademecum.blur();
		tblVademecum.setFocusedCell();
		
		txtBuscar.setValue("");
		
		commandAgregarVademecum.setEnabled(true);
		menuVademecum.memorizar([commandAgregarVademecum]);
		
		
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
			p.texto = "";
			p.phpParametros = {id_m_tipo_producto: rowDataTipo_producto.id_m_tipo_producto};
			
			this.rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.M_Parametros");
			this.rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				tableModelVademecum.setDataAsMapArray(data.result, true);
				
				if (id_m_vademecum != null) {
					tblVademecum.blur();
					tblVademecum.buscar("id_m_vademecum", id_m_vademecum);
					tblVademecum.focus();
				}
				
				//this.timerId = null;
				//this.rpc = null
			});
			
			this.rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));

			});
			
			this.opaqueCallRef = this.rpc.callAsyncListeners(false, "autocompletarVademecum", p);

		}, null, this, null, 200);
	};
	
	
	var functionBuscar = function(keySequence){
		var value = txtBuscar.getValue().trim().toUpperCase();
		
		if (value.length >=2) {
			var desde;
			
			if (keySequence == null) {
				desde = 0;
				tblVademecum.setFocusedCell();
			} else if (! keySequence.isPrintable() && keySequence.getKeyIdentifier() == "Enter") {
				var focusedRow = tblVademecum.getFocusedRow();
				desde = (focusedRow == null) ? 0 : focusedRow + 1;				
			}
			
			var rowData;
			var rowCount = tableModelVademecum.getRowCount();
			
			for (var x = desde; x < rowCount; x++) {
				rowData = tableModelVademecum.getRowData(x);
				if (rowData["codigo"].includes(value) || rowData["denominacion"].includes(value)) {
					tblVademecum.setFocusedCell(0, x, true);
					
					break;
				}
			}
		} else {
			tblVademecum.setFocusedCell();
		}
	};
	
	

	
	
	
	
	
	// Menu

	
	var commandAgregarTipo_producto = new qx.ui.command.Command("Insert");
	commandAgregarTipo_producto.addListener("execute", function(e){
		var win = new sacdiag.comp.windowMTipo_producto();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarTipoMedicamento(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAgregarTipo_producto = new qx.ui.menu.Button("Agregar...", null, commandAgregarTipo_producto);
	
	
	var commandEditarTipo_producto = new qx.ui.command.Command("F2");
	commandEditarTipo_producto.setEnabled(false);
	commandEditarTipo_producto.addListener("execute", function(e){
		var win = new sacdiag.comp.windowMTipo_producto(rowDataTipo_producto);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarTipoMedicamento(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnEditarTipo_producto = new qx.ui.menu.Button("Editar...", null, commandEditarTipo_producto);
	
	
	var menuTipo_producto = new componente.comp.ui.ramon.menu.Menu();
	
	menuTipo_producto.add(btnAgregarTipo_producto);
	menuTipo_producto.add(btnEditarTipo_producto);
	menuTipo_producto.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelTipo_producto = new qx.ui.table.model.Simple();
	tableModelTipo_producto.setColumns(["Descripción"], ["descripcion"]);
	tableModelTipo_producto.addListener("dataChanged", function(e){
		var rowCount = tableModelTipo_producto.getRowCount();
		
		tblTipo_producto.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblTipo_producto = new componente.comp.ui.ramon.table.Table(tableModelTipo_producto, custom);
	tblTipo_producto.setShowCellFocusIndicator(false);
	tblTipo_producto.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblTipo_producto.setContextMenu(menuTipo_producto);

	
	var tableColumnModelTipo_producto = tblTipo_producto.getTableColumnModel();
	
	var resizeBehaviorTipo_producto = tableColumnModelTipo_producto.getBehavior();
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
	
	
	var selectionModelTipo_producto = tblTipo_producto.getSelectionModel();
	selectionModelTipo_producto.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelTipo_producto.addListener("changeSelection", function(e){
		if (! selectionModelTipo_producto.isSelectionEmpty()) {
			rowDataTipo_producto = tableModelTipo_producto.getRowDataAsMap(tblTipo_producto.getFocusedRow());
			
			commandEditarTipo_producto.setEnabled(true);
			
			functionActualizarVademecum();
		} else {
			commandEditarTipo_producto.setEnabled(false);
		}
		
		menuTipo_producto.memorizar([commandEditarTipo_producto]);
	});

	this.add(tblTipo_producto, {left: 0, top: 20, right: "51%", bottom: 0});	
	
	this.add(new qx.ui.basic.Label("Tipo de producto"), {left: 0, top: 0});
	
	
	

	
	
	var aux = new qx.ui.layout.HBox(6).set({alignY: "middle"});
	//aux.setAlignY("middle");
	var composite = new qx.ui.container.Composite(aux);
	this.add(composite, {left: "51%", top: 3});
	
	composite.add(new qx.ui.basic.Label("Buscar medicamento:"));
	//this.add(new qx.ui.basic.Label("Buscar prestación:"), {left: "53%", top: 3});
	
	
	var txtBuscar = new qx.ui.form.TextField("");
	txtBuscar.setWidth(250);
	txtBuscar.setLiveUpdate(true);
	txtBuscar.addListener("changeValue", function(e){
		functionBuscar();
	})
	txtBuscar.addListener("keypress", function(e){
		functionBuscar(e);
	})
	//this.add(txtBuscar, {left: "61%", top: 0});
	composite.add(txtBuscar);
	
	
	var btnBuscar = new qx.ui.form.Button("Buscar");
	btnBuscar.addListener("execute", function(e){
		var value = txtBuscar.getValue().trim().toUpperCase();
		
		if (value.length >=2) {
			var focusedRow = tblVademecum.getFocusedRow();
			var desde = (focusedRow == null) ? 0 : focusedRow + 1;				
			
			var rowData;
			var rowCount = tableModelVademecum.getRowCount();
			
			for (var x = desde; x < rowCount; x++) {
				rowData = tableModelVademecum.getRowData(x);
				if (rowData["codigo"].includes(value) || rowData["denominacion"].includes(value)) {
					tblVademecum.setFocusedCell(0, x, true);
					
					break;
				}
			}
		} else {
			tblVademecum.setFocusedCell();
		}
	});
	composite.add(btnBuscar);
	//this.add(txtBuscar, {left: "61%", top: 0});
	
	
	
	// Menu

	
	var commandAgregarVademecum = new qx.ui.command.Command("Insert");
	commandAgregarVademecum.setEnabled(false);
	commandAgregarVademecum.addListener("execute", function(e){
		var win = new sacdiag.comp.windowMVademecum(null, rowDataTipo_producto.id_m_tipo_producto);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarVademecum(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAgregarVademecum = new qx.ui.menu.Button("Agregar...", null, commandAgregarVademecum);
	
	
	var commandEditarVademecum = new qx.ui.command.Command("F2");
	commandEditarVademecum.setEnabled(false);
	commandEditarVademecum.addListener("execute", function(e){
		var win = new sacdiag.comp.windowMVademecum(rowDataVademecum, rowDataTipo_producto.id_m_tipo_producto);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarVademecum(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnEditarVademecum = new qx.ui.menu.Button("Editar...", null, commandEditarVademecum);
	
	
	var menuVademecum = new componente.comp.ui.ramon.menu.Menu();
	
	menuVademecum.add(btnAgregarVademecum);
	menuVademecum.add(btnEditarVademecum);
	menuVademecum.memorizar();
	
	
	
	
	//Tabla
	
	
	var tableModelVademecum = new qx.ui.table.model.Simple();
	tableModelVademecum.setColumns(["Código", "Descripción", "Precio", "Presentación", "Forma"], ["codigo_heredado", "descripcion", "precio", "presentacion", "forma_farmaceutica"]);
	tableModelVademecum.addListener("dataChanged", function(e){
		var rowCount = tableModelVademecum.getRowCount();
		
		tblVademecum.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblVademecum = new componente.comp.ui.ramon.table.Table(tableModelVademecum, custom);
	tblVademecum.setShowCellFocusIndicator(false);
	tblVademecum.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblVademecum.setContextMenu(menuVademecum);
	
	var tableColumnModelVademecum = tblVademecum.getTableColumnModel();
	
	var resizeBehaviorVademecum = tableColumnModelVademecum.getBehavior();

	resizeBehaviorVademecum.set(0, {width:"15%", minWidth:100});
	resizeBehaviorVademecum.set(1, {width:"52%", minWidth:100});
	resizeBehaviorVademecum.set(2, {width:"12%", minWidth:100});
	
	
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelVademecum.setDataCellRenderer(2, cellrendererNumber);

	
	
	var selectionModelVademecum = tblVademecum.getSelectionModel();
	selectionModelVademecum.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelVademecum.addListener("changeSelection", function(e){
		if (! selectionModelVademecum.isSelectionEmpty()) {
			rowDataVademecum = tableModelVademecum.getRowDataAsMap(tblVademecum.getFocusedRow());
			
			commandEditarVademecum.setEnabled(true);
		} else {
			commandEditarVademecum.setEnabled(false);
		}
		
		menuVademecum.memorizar([commandEditarVademecum]);
	});

	this.add(tblVademecum, {left: "51%", top: 30, right: 0, bottom: 0});
	
	//this.add(new qx.ui.basic.Label("Buscar prestación:"), {left: "53%", top: 3});
	
	
	

	tblTipo_producto.setTabIndex(1);
	txtBuscar.setTabIndex(2);
	tblVademecum.setTabIndex(3);
	
	
	
	functionActualizarTipoMedicamento();
	
	
		
	},
	members : 
	{

	}
});