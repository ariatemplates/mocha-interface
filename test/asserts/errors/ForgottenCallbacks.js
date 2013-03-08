Aria.classDefinition({
	$classpath : "errors.ForgottenCallbacks",
	$extends : "aria.jsunit.TestCase",
	$constructor : function (tester) {
		tester.on("end", function () {
			tester.hasError("$callbacks");
		});
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testForget : function () {
			// I'm doing it on purpose, this callback is never removed
			aria.core.Timer.addCallback({
				fn : Aria.empty,
				scope : this,
				delay : 1000
			});
		}
	}
});
