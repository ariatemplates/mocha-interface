// Just in case the jsunit package was already loaded before
aria.core.ClassMgr.unloadClass("aria.jsunit.Assert");

Aria.classDefinition({
	$classpath : "aria.jsunit.Assert",
	// I don't feel the need of extending from aria.jsunit.Test because that class defines methods to
	// interact with an aria test runner
	$prototype : {
		assertTrue : function (value, optMsg) {
			try {
				expect(value).to.be(true);
			} catch (ex) {
				ex.message += "\n" + optMsg;
				throw ex;
			}
		},

		assertFalse : function (value, optMsg) {
			try {
				expect(value).to.be(false);
			} catch (ex) {
				ex.message += "\n" + optMsg;
				throw ex;
			}
		},

		assertEquals : function (value1, value2, optMsg) {
			try {
				expect(value1).to.equal(value2);
			} catch (ex) {
				ex.message += "\n" + optMsg;
				throw ex;
			}
		},

		assertNotEquals : function (value1, value2, optMsg, optAssertId) {
			try {
				expect(value1).not.to.equal(value2);
			} catch (ex) {
				ex.message += "\n" + optMsg;
				throw ex;
			}
		},

		assertLogsEmpty : function (raiseException, countAsAssert) {
			if (this.__logAppender.messages.error.length !== 0) {
				// This is going to throw an exception, log the just the first error
				var error = new Error(this.__logAppender.messages.error.length + " Uncaught error(s) detected");
				error.actual = this.__logAppender.messages.error;
				error.expected = "-no error-";
				// FIXME broken in expect.js, shouldn't be a function
				expect().fail(function () {
					return error;
				});
			}
		},

		assertErrorInLogs : function (errorMsg, count) {
			if (!errorMsg) {
				// FIXME broken in expect.js, shouldn't be a function
				expect().fail(function () {
					return "assertErrorInLogs was called with an empty error message.";
				});
			} else {
				// We expect a certain number of error messages failed
				var logCount = 0;
				for (var i = this.__logAppender.messages.error.length - 1; i >= 0; i -= 1) {
					var error = this.__logAppender.messages.error[i];
					if (error.id === errorMsg) {
						logCount += 1;
						this.__logAppender.messages.error.splice(i, 1);
					}
				}
				if (count) {
					// The number should be precise
					if (logCount !== count) {
						expect().fail(function () {
							return "Error '" + errorMsg + "' found " + logCount + " time(s) in logs, expecting " + count;
						});
					}
				} else {
					// At least one
					if (logCount === 0) {
						expect().fail(function () {
							return "Error '" + errorMsg + "' not found in logs";
						});
					}
				}
			}
		},

		assertJsonContains : function (bigJ, smallJ, optMsg) {
			try {
				expect(aria.utils.Json.contains(bigJ, smallJ)).to.be(true);
			} catch (ex) {
				ex.message += "\n" + optMsg;
				throw ex;
			}
		},

		assertJsonEquals : function (obj1, obj2, optMsg) {
			try {
				expect(obj1).to.eql(obj2);
			} catch (ex) {
				ex.message += "\n" + optMsg;
				throw ex;
			}
		},

		assertJsonNotEquals : function (obj1, obj2, optMsg) {
			try {
				expect(obj1).not.to.eql(obj2);
			} catch (ex) {
				ex.message += "\n" + optMsg;
				throw ex;
			}
		},

		fail : function (optMsg) {
			expect().fail(function () {
				return optMsg;
			});
		},

		hasError : function () {
			// TODO
		},

		getErrors : function () {
			// TODO
		},

		hasWarning : function () {
			// TODO
		},

		getExecutionErrors : function () {
			// TODO
		},

		getFailures : function () {
			// TODO
		},

		raiseError : function (err, optMsg) {
			// TODO
		},

		raiseFailure : function (msg) {
			// TODO
		},

		registerObject : function (jsObject) {
			// TODO
		},

		unregisterObject : function (jsObject) {
			// TODO
		},

		assertEventFired : function (evtName, msg) {
			// TODO
		},

		assertEventNotFired : function (evtName, msg) {
			// TODO
		},

		getEvent : function (evtName) {
			// TODO
		},

		clearLogs : function () {
			// TODO
		},

		registerExpectedEventsList : function (evtList) {
			// TODO
		},

		checkExpectedEvent : function (evt) {
			// TODO
		},

		checkExpectedEventListEnd : function () {
			// TODO
		},

		overrideClass : function (initialClass, mockClass) {
			// TODO
		},

		resetClassOverrides : function () {
			// TODO
		},

		checkEvent : function (evt) {
			// TODO
		}
	}
});