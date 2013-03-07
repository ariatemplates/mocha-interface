Aria.classDefinition({
	$classpath : "resources.InterfacedObject",
	$implements : ["types.Interface"],
	$constructor : function () {
		this.points = 0;
	},
	$prototype : {
		score : function () {
			this.points += 1;
			this.$raiseEvent("play");
		}
	}
});
