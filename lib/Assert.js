// Just in case the jsunit package was already loaded before
aria.core.ClassMgr.unloadClass("aria.jsunit.Assert");

Aria.classDefinition({
	$classpath : "aria.jsunit.Assert",
	// I don't feel the need of extending from aria.jsunit.Test because that class defines methods to
	// interact with an aria test runner
	$constructor : function () {
		// I don't like having it here, but it was a public variable...
		// contains the list of events raised by registered objects
		this.evtLogs = [];

		// This one is new, keep a reference of all the registered objects in order to unregister them
		this.__registeredObjects = [];
	},
	$destructor : function () {
		this.unregisterObject();
	},
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

		/* The following methods have been removed in 1.4.1
		 * Keep them here in case we're testing an older version
		 * But it'd be nice to get rid of them
		 */
		hasError : function () {
			return this.getErrors().length > 0;
		},

		getErrors : function () {
			return this._errors;
		},

		hasWarning : function () {
			return false;
		},

		getExecutionErrors : function () {
			if (this.$Test.getExecutionErrors) {
				return this.$Test.getExecutionErrors.apply(this, arguments);
			} else {
				var executionErrors = [];
				var errors = this.getErrors();
				for (var i = 0, l = errors.length; i < l; i++) {
					var error = errors[i];
					if (error.type == this.ERROR_TYPES.ERROR) {
						executionErrors.push(error);
					}
				}
				return executionErrors;
			}
		},

		getFailures : function () {
			if (this.$Test.getFailures) {
				return this.$Test.getFailures.apply(this, arguments);
			} else {
				var failures = [];
				var errors = this.getErrors();
				for (var i = 0, l = errors.length; i < l; i++) {
					var error = errors[i];
					if (error.type == this.ERROR_TYPES.FAILURE) {
						failures.push(error);
					}
				}
				return failures;
			}
		},

		raiseError : function (err, optMsg) {
			if (this.$Test.raiseError) {
				return this.$Test.raiseError.apply(this, arguments);
			} else {
				var msg = (err.description) ? err.description : err.message;
				msg = '[' + msg + ']';
				if (optMsg) {
					msg += " " + optMsg;
				}

				this._errors.push({
					type : this.ERROR_TYPES.ERROR,
					testMethod : this._currentTestName,
					description : msg
				});

				// note: no exception need to be thrown as we are already in an exception call
				this.$raiseEvent({
					name : "error",
					testClass : this.$classpath,
					testState : this._currentTestName,
					exception : err,
					msg : msg
				});
			}
		},

		raiseFailure : function (msg) {
			if (this.$Test.raiseFailure) {
				return this.$Test.raiseFailure.apply(this, arguments);
			} else {
				this._errors.push({
					type : this.ERROR_TYPES.FAILURE,
					testMethod : this._currentTestName,
					description : msg
				});

				this.$raiseEvent({
					name : "failure",
					testClass : this.$classpath,
					testState : this._currentTestName,
					description : msg
				});
			}
		},
		/*
		 * End of useless methods
		 */

		registerObject : function (jsObject) {
			this.__registeredObjects.push(jsObject);
			jsObject.$on({
				"*" : this._logEvent,
				scope : this
			});
		},

		unregisterObject : function (jsObject) {
			if (jsObject) {
				jsObject.$removeListeners({
					"*" : this._logEvent,
					scope : this
				});
				for (var i = 0; i < this.__registeredObjects.length; i += 1) {
					if (this.__registeredObjects[i] === jsObject) {
						this.__registeredObjects.splice(i, 1);
						break;
					}
				}
			} else {
				for (var i = 0; i < this.__registeredObjects.length; i += 1) {
					this.__registeredObjects[i].$removeListeners({
						"*" : this._logEvent,
						scope : this
					});
				}
				this.__registeredObjects = [];
			}
		},

		_logEvent : function (evt) {
			this.evtLogs.push(evt);
		},

		assertEventFired : function (evtName, msg) {
			try {
				expect(this.getEvent(evtName)).to.be.ok();
			} catch (ex) {
				msg = msg || "Expecting event '" + evtName + "' to be fired";
				ex.message = msg;
				throw ex;
			}
		},

		assertEventNotFired : function (evtName, msg) {
			try {
				expect(this.getEvent(evtName)).not.to.be.ok();
			} catch (ex) {
				msg = msg || "Expecting event '" + evtName + "' not to be fired";
				ex.message = msg;
				throw ex;
			}
		},

		getEvent : function (evtName) {
			for (var i = 0; i < this.evtLogs.length; i += 1) {
				if (this.evtLogs[i].name === evtName) {
					return this.evtLogs[i];
				}
			}
		},

		clearLogs : function () {
			this.evtLogs = [];
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
