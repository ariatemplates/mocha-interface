Aria.classDefinition({
	$classpath : "errors.FailInConstructor",
	$extends : "aria.jsunit.TestCase",
	$constructor : function (tester) {
		this.$TestCase.constructor.call(this);
		tester.on("end", function () {
			tester.hasError("$constructor");
		});

		throw new Error("I'm failing");
	}
});
