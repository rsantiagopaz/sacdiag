qx.Class.define("servicio_social.comp.windowPrestacion",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Nuevo item",
		//width: 500,
		height: 300,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		cboPrestacion.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	

	
	
	
	
	
	var form2 = new qx.ui.form.Form();
	
	var cboPrestacion = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestacion"});
	cboPrestacion.setRequired(true);
	form2.add(cboPrestacion, "Prestación", null, "prestacion", null, {grupo: 1, tabIndex: 16, item: {row: 0, column: 1, colSpan: 17}});
	
	var lstPrestacion = cboPrestacion.getChildControl("list");
	form2.add(lstPrestacion, "", null, "id_ta_prestacion");
	
	var cboEstablecimiento = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarEstablecimiento"});
	cboEstablecimiento.setRequired(true);
	form2.add(cboEstablecimiento, "Establecimiento", null, "establecimiento", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 17}});
	
	var lstEstablecimiento = cboEstablecimiento.getChildControl("list");
	form2.add(lstEstablecimiento, "", null, "id_ta_establecimiento");
	
	var txtF_turno = new qx.ui.form.DateField();
	txtF_turno.setRequired(true);
	form2.add(txtF_turno, "F.turno", null, "f_turno", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 4}});
	
	var txtEstudios_a_realizar = new qx.ui.form.TextArea();
	form2.add(txtEstudios_a_realizar, "Estudios a realizar", null, "estudios_a_realizar", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 17}});
	
	var txtCant_acompanantes = new qx.ui.form.Spinner();
	txtCant_acompanantes.setNumberFormat(application.numberformatEntero);
	txtCant_acompanantes.getChildControl("upbutton").setVisibility("excluded");
	txtCant_acompanantes.getChildControl("downbutton").setVisibility("excluded");
	txtCant_acompanantes.setSingleStep(0);
	txtCant_acompanantes.setPageStep(0);
	form2.add(txtCant_acompanantes, "Cant.acompañantes", null, "cant_acompanantes", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 2}});
	
	var txtCant_dias = new qx.ui.form.Spinner();
	txtCant_dias.setNumberFormat(application.numberformatEntero);
	txtCant_dias.getChildControl("upbutton").setVisibility("excluded");
	txtCant_dias.getChildControl("downbutton").setVisibility("excluded");
	txtCant_dias.setSingleStep(0);
	txtCant_dias.setPageStep(0);
	form2.add(txtCant_dias, "Cant.dias", null, "cant_dias", null, {grupo: 1, item: {row: 4, column: 8, colSpan: 2}});
	
	var txtMonto_presup = new qx.ui.form.Spinner(0, 0, 1000000);
	txtMonto_presup.setRequired(true);
	txtMonto_presup.setNumberFormat(application.numberformatMontoEn);
	txtMonto_presup.getChildControl("upbutton").setVisibility("excluded");
	txtMonto_presup.getChildControl("downbutton").setVisibility("excluded");
	txtMonto_presup.setSingleStep(0);
	txtMonto_presup.setPageStep(0);
	form2.add(txtMonto_presup, "Monto presupuestado", null, "monto_presup", null, {grupo: 1, item: {row: 4, column: 15, colSpan: 3}});

	
	
	var controllerForm2 = new qx.data.controller.Form(null, form2);
	controllerForm2.createModel(true);
	
	var formView2 = new qx.ui.form.renderer.Double(form2);
	var formView2 = new componente.comp.ui.ramon.abstractrenderer.Grid(form2, 12, 40, 1);
	
	this.add(formView2, {left: 0, top: 0});
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form2.validate()) {
			var p = qx.util.Serializer.toNativeObject(controllerForm2.getModel());
			
			btnCancelar.execute();
			
			this.fireDataEvent("aceptado", p);
			
		} else {
			form2.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});