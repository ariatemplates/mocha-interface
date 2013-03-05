Aria.classDefinition({
	$classpath : "errors.WrongNotify",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testAsyncWhatever : function (tester) {
			var testCase = this;
			setTimeout(function () {
				testCase.notifyTestEnd("not really");
			}, 10);

			tester.on("end", function () {
				tester.hasError("$notifyTestEnd");
			});
		},

		testAsyncNotTooStrict : function () {
			var testCase = this;
			setTimeout(function () {
				// call the method with parenthesis, ugly but not a big deal
				testCase.notifyTestEnd("testAsyncNotTooStrict()");
			}, 10);
		}
	}
});
