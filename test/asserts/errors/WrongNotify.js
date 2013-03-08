Aria.classDefinition({
	$classpath : "errors.WrongNotify",
	$extends : "aria.jsunit.TestCase",
	$constructor : function (tester) {
		tester.on("after_testAsyncWhatever", function () {
			tester.hasError("$notifyTestEnd");
		});
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testAsyncWhatever : function () {
			var testCase = this;
			setTimeout(function () {
				testCase.notifyTestEnd("not really");
			}, 10);
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
