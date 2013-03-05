/**
 * Check that error messages are reported correctly for failures in the asynchronous callback
 */
Aria.classDefinition({
	$classpath : "AsyncFailures",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		tearDown : function () {
			this.assertErrorInLogs(aria.jsunit.TestCase.EXCEPTION_IN_METHOD);
		},

		testAsyncException : function () {
			var testCase = this;
			setTimeout(function () {
				testCase.raiseException();
			}, 60);
		},

		raiseException : function () {
			throw new Error("yeah");
		}
	}
});