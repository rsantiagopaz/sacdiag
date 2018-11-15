qx.Class.define("sacdiag.comp.windowWebService",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Consultar Web services",
		width: 800,
		//height: 240,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});

	
	var layout = new qx.ui.layout.Grid(6, 6);
	layout.setRowAlign(0, "right", "middle");
	layout.setColumnFlex(6, 1);
	this.setLayout(layout);

	this.addListenerOnce("appear", function(e){
		txtDni.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	

	this.add(new qx.ui.basic.Label("D.N.I.:"), {row: 0, column: 0});
	
	var txtDni = new qx.ui.form.TextField("21902181");
	this.add(txtDni, {row: 0, column: 2});
	
	var slbWebService = new qx.ui.form.SelectBox();
	slbWebService.setMinWidth(300);
	slbWebService.add(new qx.ui.form.ListItem("PUCO - Padrón Único Consolidado Operativo", null, "puco"));
	slbWebService.add(new qx.ui.form.ListItem("IOSEP1", null, "iosep1"));
	slbWebService.add(new qx.ui.form.ListItem("IOSEP2", null, "iosep2"));
	this.add(slbWebService, {row: 0, column: 3});
	
	var btnConsultar = new qx.ui.form.Button("Consultar...");
	btnConsultar.addListener("execute", function(e){
		var p = {};
		
			var rpc = new sacdiag.comp.rpc.Rpc("services/", "comp.Puco");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));

			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				alert(qx.lang.Json.stringify(data, null, 2));
			}, this);
			rpc.callAsyncListeners(true, "prueba", p);
	});
	this.add(btnConsultar, {row: 0, column: 5});
	
	this.add(new qx.ui.basic.Label("Datos:"), {row: 2, column: 0});
	
	var txtDatos = new qx.ui.form.TextArea("");
	txtDatos.setMinHeight(300);
	txtDatos.setReadOnly(true);
	this.add(txtDatos, {row: 3, column: 0, colSpan: 7});
	
	
	
	
	

	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});