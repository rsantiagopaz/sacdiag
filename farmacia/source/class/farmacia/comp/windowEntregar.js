qx.Class.define("farmacia.comp.windowEntregar",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (cantidad_maxima)
	{
	this.base(arguments);
	
	this.set({
		width: 250,
		height: 150,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		btnCancelar.focus();
		txtCantidad.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	
	var form = new qx.ui.form.Form();
	
	
	var txtCantidad = new qx.ui.form.Spinner(0, 1, cantidad_maxima);
	txtCantidad.setRequired(true);
	form.add(txtCantidad, "Cantidad", function(value) {
		if (txtCantidad.getValue() <= 0) throw new qx.core.ValidationError("Validation Error", "Debe ingresar cantidad");
	}, "cantidad");
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			btnCancelar.execute();
			
			this.fireDataEvent("aceptado", txtCantidad.getValue());
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "10%", bottom: 0});
	this.add(btnCancelar, {right: "10%", bottom: 0});
	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});