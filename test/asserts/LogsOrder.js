Aria.classDefinition({
	$classpath : "LogsOrder",
	$extends : "aria.jsunit.TestCase",
	$constructor : function (tester) {
		var self = this;
		this.eventsReceived = [];

		tester.on("begin", function () {
			self.eventsReceived.push("begin");
		});
		tester.on("before_testOne", function () {
			self.eventsReceived.push("before_testOne");
		});
		tester.on("after_testOne", function () {
			self.eventsReceived.push("after_testOne");
		});
		tester.on("end", function () {
			self.eventsReceived.push("end");

			expect(self.eventsReceived).to.eql(["begin", "before_testOne", "after_testOne", "end"]);
		});
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testOne : function () {
			// Do nothing, wait for test end to check the logs
		}
	}
});
