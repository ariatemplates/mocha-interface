/**
 * Check that failing assertion with custom message fail raising the proper message
 */
Aria.classDefinition({
	$classpath : "CustomMessage",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testFailWithMessage : function () {
			var testCase = this;
			expect(function () {
				testCase.assertTrue(124, "Not a number");
			}).to.throwException(/Not a number/);

			expect(function () {
				testCase.assertFalse("not really", "Not a string");
			}).to.throwException(/Not a string/);

			expect(function () {
				testCase.assertEquals(3, "3", "Not quite the same");
			}).to.throwException(/Not quite the same/);

			expect(function () {
				testCase.assertNotEquals(true, true, "Yes they are the same");
			}).to.throwException(/Yes they are the same/);

			expect(function () {
				testCase.assertJsonContains({}, {a : 1}, "It's not there");
			}).to.throwException(/It's not there/);

			expect(function () {
				testCase.assertJsonEquals({b : 2}, {a : 1}, "%1 differs from %2");
			}).to.throwException(/%1 differs from %2/);

			expect(function () {
				testCase.assertJsonNotEquals({}, {}, "%1 equals %2");
			}).to.throwException(/%1 equals %2/);
		}
	}
});