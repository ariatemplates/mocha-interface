Aria.classDefinition({
	$classpath : "resources.DataClass",
	// This class depends on a utility that is not loaded already, quite sure about that
	$dependencies : ["aria.utils.Xml"],
	$extends : "resources.DeadEnd",
	$singleton : true,
	$constructor : function () {
		this.one = 1;
		this.$DeadEnd.constructor.call(this);
	},
	$prototype : {
		two : 2,

		testSomething : function () {
			// No-one is calling this method, so it's fine to just let it fail if called
			expect("don't call me").to.be.a("number");
		}
	}
});