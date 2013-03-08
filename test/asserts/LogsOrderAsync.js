Aria.classDefinition({
	$classpath : "LogsOrderAsync",
	$extends : "aria.jsunit.TestCase",
	$constructor : function (tester) {
		var self = this;
		this.eventsReceived = [];

		tester.on("begin", function () {
			self.eventsReceived.push("begin");
		});
		tester.on("before_testAsyncOne", function () {
			self.eventsReceived.push("before_testAsyncOne");
		});
		tester.on("after_testAsyncOne", function () {
			self.eventsReceived.push("after_testAsyncOne");
		});
		tester.on("end", function () {
			self.eventsReceived.push("end");

			expect(self.eventsReceived).to.eql(["begin", "before_testAsyncOne", "after_testAsyncOne", "end"]);
		});
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testAsyncOne : function () {
			var self = this;
			setTimeout(function () {
				self.notifyTestEnd("testAsyncOne");
			}, 30);
		}
	}
});
