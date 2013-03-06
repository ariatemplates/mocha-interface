Aria.classDefinition({
	$classpath : "resources.WrongParentConstructor",
	$extends : "resources.AlmostADeadEnd",
	$destructor : function () {
		// call the grandparent
		this.$DeadEnd.$destructor.call(this);
	}
});
