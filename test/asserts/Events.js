Aria.classDefinition({
	$classpath : "Events",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["resources.EventRaiser"],
	$prototype : {
		testEventFired : function () {
			var testCase = this;
			var eventEmitter = Aria.getClassInstance("resources.EventRaiser");
			this.registerObject(eventEmitter);

			// No events were thrown yet
			expect(function () {
				testCase.assertEventFired("one");
			}).to.throwException(/Expecting event 'one' to be fired/);

			// Raise the event
			eventEmitter.$raiseEvent("one");

			testCase.assertEventFired("one");
			expect(function () {
				testCase.assertEventFired("two", "my message");
			}).to.throwException(/my message/);

			testCase.clearLogs();
			expect(function () {
				testCase.assertEventFired("one");
			}).to.throwException(/Expecting event 'one' to be fired/);

			eventEmitter.$dispose();
		},

		testEventDescription : function () {
			var eventEmitter = Aria.getClassInstance("resources.EventRaiser");
			this.registerObject(eventEmitter);

			eventEmitter.$raiseEvent({
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

			eventEmitter.$dispose();
		},

		testEventNotFired : function () {
			var testCase = this;
			var eventEmitter = Aria.getClassInstance("resources.EventRaiser");
			this.registerObject(eventEmitter);

			eventEmitter.$raiseEvent("one");
			expect(function () {
				testCase.assertEventNotFired("one");
			}).to.throwException(/Expecting event 'one' not to be fired/);

			eventEmitter.$dispose();
		},

		testUnregister : function () {
			var testCase = this;
			var eventEmitter = Aria.getClassInstance("resources.EventRaiser");
			this.registerObject(eventEmitter);

			// and now unregister
			this.unregisterObject(eventEmitter);

			eventEmitter.$raiseEvent("one");

			expect(function () {
				testCase.assertEventFired("one");
			}).to.throwException(/Expecting event 'one' to be fired/);

			eventEmitter.$dispose();
		},

		testAutomaticUnregister : function (tester) {
			var eventEmitter = Aria.getClassInstance("resources.EventRaiser");
			this.registerObject(eventEmitter);
			tester.on("end", function () {
				expect(eventEmitter._listeners["*"]).not.to.be.ok();
				eventEmitter.$dispose();
			});
		}
	}
});
