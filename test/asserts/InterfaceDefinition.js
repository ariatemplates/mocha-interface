Aria.classDefinition({
	$classpath : "InterfaceDefinition",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["resources.InterfacedObject"],
	$prototype : {
		testLoadingInterfaces : function () {
			var privateObject = Aria.getClassInstance("resources.InterfacedObject");
			var publicObject = privateObject.$interface("types.Interface");

			this.registerObject(publicObject);
			publicObject.score();

			expect(privateObject.points).to.be(1);
			this.assertEventFired("play");

			this.unregisterObject(publicObject);
			privateObject.$dispose();
		}
	}
});
