Aria.classDefinition({
	$classpath : "Logs",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testAssertLogsEmpty : function () {
			this.assertLogsEmpty();
		},

		testAssertErrorInLogs_Empty : function () {
			var testCase = this;
			expect(function () {
				testCase.assertErrorInLogs("Some error");
			}).to.throwException(/Error 'Some error' not found in logs/);
		},

		testAssertErrorInLogs_Found : function () {
			this.$logError("A");
			this.assertErrorInLogs("A");
		},

		testAssertErrorInLogs_Multiple : function () {
			this.$logError("B");
			this.$logError("B");
			this.assertErrorInLogs("B", 2);
		},

		testAssertErrorInLogs_MultipleNoCount : function () {
			this.$logError("B");
			this.$logError("B");
			this.$logError("B");
			this.assertErrorInLogs("B");
		},

		testAssertErrorInLogs_WrongErrorMessage : function () {
			var testCase = this;
			expect(function () {
				testCase.$logError("C");
				testCase.assertErrorInLogs("D");
			}).to.throwException(/Error 'D' not found in logs/);

			this.assertErrorInLogs("C");
		},

		testAssertErrorInLogs_WrongCount : function () {
			var testCase = this;
			expect(function () {
				testCase.$logError("E");
				testCase.assertErrorInLogs("E", 2);
			}).to.throwException(/Error 'E' found 1 time\(s\) in logs, expecting 2/);
		},

		testAssertErrorInLogs_NoMessage : function () {
			var testCase = this;
			expect(function () {
				testCase.assertErrorInLogs();
			}).to.throwException(/assertErrorInLogs was called with an empty error message/);
		},

		testAsserNonErrors : function () {
			// All types of logs should be considered by assertError in logs
			debugger;
			this.$logWarn("F");
			this.$logDebug("F");
			this.$logInfo("F");

			this.assertErrorInLogs("F", 3);
		}
	}
});
