/**
 * Test that async tests are handled correctly, meaning the the second one executes after the callback of the first one.
 * The strategy chosen is to mark begin and end of each test, when the second test starts (we don't know which one starts first)
 * both start and end should be either true or false
 */
Aria.classDefinition({
	$classpath : "AsyncTest",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		status : {
			A : {
				started : false,
				ended : false
			},
			B : {
				started : false,
				ended : false
			}
		},

		testAsyncA : function () {
			this.status.A.started = true;

			// either started and ended or none of them
			expect(this.status.B.started).to.equal(this.status.B.ended);

			aria.core.Timer.addCallback({
				fn : this.endA,
				scope : this,
				delay : 60
			});
		},

		endA : function () {
			this.status.A.ended = true;
			expect(this.status.B.started).to.equal(this.status.B.ended);
			this.notifyTestEnd("testAsyncA");
		},

		testAsyncB : function () {
			this.status.B.started = true;

			// either started and ended or none of them
			expect(this.status.A.started).to.equal(this.status.A.ended);

			aria.core.Timer.addCallback({
				fn : this.endB,
				scope : this,
				delay : 60
			});
		},

		endB : function () {
			this.status.B.ended = true;
			expect(this.status.A.started).to.equal(this.status.A.ended);
			this.notifyTestEnd("testAsyncB");
		}
	}
});