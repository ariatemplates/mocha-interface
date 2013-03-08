Aria.classDefinition({
	$classpath : "Events",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["resources.EventRaiser"],
	$constructor : function (tester) {
		this.eventEmitter = null;
		var testCase = this;
		tester.on("after_testAutomaticUnregister", function () {
			expect(testCase.eventEmitter._listeners["*"]).not.to.be.ok();
			testCase.eventEmitter.$dispose();
		});
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		setUp : function () {
			this.eventEmitter = Aria.getClassInstance("resources.EventRaiser");
			this.registerObject(this.eventEmitter);
		},

		testEventFired : function () {
			var testCase = this;

			// No events were thrown yet
			expect(function () {
				testCase.assertEventFired("one");
			}).to.throwException(/Expecting event 'one' to be fired/);

			// Raise the event
			this.eventEmitter.$raiseEvent("one");

			testCase.assertEventFired("one");
			expect(function () {
				testCase.assertEventFired("two", "my message");
			}).to.throwException(/my message/);

			testCase.clearLogs();
			expect(function () {
				testCase.assertEventFired("one");
			}).to.throwException(/Expecting event 'one' to be fired/);

			this.eventEmitter.$dispose();
		},

		testEventDescription : function () {
			this.eventEmitter.$raiseEvent({
				name : "two",
				prop1 : 1,
				prop2 : 2
			});
			var eventRaised = this.getEvent("two");
			this.assertJsonContains(eventRaised, {
				name : "two",
				prop1 : 1,
				prop2 : 2
			});

			this.eventEmitter.$dispose();
		},

		testEventNotFired : function () {
			var testCase = this;

			this.eventEmitter.$raiseEvent("one");
			expect(function () {
				testCase.assertEventNotFired("one");
			}).to.throwException(/Expecting event 'one' not to be fired/);

			this.eventEmitter.$dispose();
		},

		testUnregister : function () {
			var testCase = this;

			// and now unregister
			this.unregisterObject(this.eventEmitter);

			this.eventEmitter.$raiseEvent("one");

			expect(function () {
				testCase.assertEventFired("one");
			}).to.throwException(/Expecting event 'one' to be fired/);

			this.eventEmitter.$dispose();
		},

		testAutomaticUnregister : function () {
			// this is handled by tester.on in the constructor
		}
	}
});
