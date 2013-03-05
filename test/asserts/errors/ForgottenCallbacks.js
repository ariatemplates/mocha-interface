Aria.classDefinition({
	$classpath : "errors.ForgottenCallbacks",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testForget : function (tester) {
			// I'm doing it on purpose, this callback is never removed
			aria.core.Timer.addCallback({
				fn : Aria.empty,
				scope : this,
				delay : 1000
			});

			tester.on("end", function () {
				tester.hasError("$callbacks");
			});
		}
	}
});
