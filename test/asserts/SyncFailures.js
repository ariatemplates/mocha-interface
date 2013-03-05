/**
 * This test verifies that all negative assertions throw an exception
 * The exception should be caught by mocha to signal a failing test
 */
Aria.classDefinition({
	$classpath : "SyncFailures",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testAssertTrue : function () {
			var testClass = this;
			expect(function () {
				testClass.assertTrue(false);
			}).to.throwException(/expected false to equal true/);

			expect(function () {
				testClass.assertTrue(12);
			}).to.throwException(/expected 12 to equal true/);

			expect(function () {
				testClass.assertTrue({});
			}).to.throwException(/expected \{\} to equal true/);
		},

		testAssertFalse : function () {
			var testClass = this;
			expect(function () {
				testClass.assertFalse(true);
			}).to.throwException(/expected true to equal false/);

			expect(function () {
				testClass.assertFalse(null);
			}).to.throwException(/expected null to equal false/);
		},

		testAssertEquals : function () {
			var testClass = this;
			expect(function () {
				testClass.assertEquals(1, 2);
			}).to.throwException(/expected 1 to equal 2/);

			expect(function () {
				testClass.assertEquals(1, "1");
			}).to.throwException(/expected 1 to equal ['"]1['"]/);

			expect(function () {
				testClass.assertEquals(null);
			}).to.throwException(/expected null to equal undefined/);
		},

		testAssertNotEquals : function () {
			var testClass = this;
			expect(function () {
				testClass.assertNotEquals(1, 1);
			}).to.throwException(/expected 1 to not equal 1/);
		},

		testJsonContains : function () {
			var testClass = this;
			expect(function () {
				testClass.assertJsonContains({
					one : 1,
					two : 2,
					three : 3
				}, {
					two : 2,
					one : 1,
					four : 4
				});
			}).to.throwException(/expected false to equal true/);
		},

		testAssertJsonEquals : function () {
			var testClass = this;
			expect(function () {
				testClass.assertJsonEquals({
					a : {
						b : "c"
					}
				}, {
					a : "c"
				});
			}).to.throwException(/expected \{(.*)\} to sort of equal \{\s?a\s?:\s?['"]c['"]\s?\}/);

			expect(function () {
				testClass.assertJsonEquals([1, 2, 3], [1, 3]);
			}).to.throwException(/expected \[ 1, 2, 3 \] to sort of equal \[ 1, 3 \]/);
		},

		testAssertJsonNotEquals : function () {
			var testClass = this;
			expect(function () {
				testClass.assertJsonNotEquals({
					a : 1
				}, {
					a : 1
				});
			}).to.throwException(/expected \{\s?a\s?:\s?1\s?\} to sort of not equal \{\s?a\s?:\s?1\s?\}/);

			expect(function () {
				testClass.assertJsonNotEquals([1, 2], [1, 2]);
			}).to.throwException(/expected \[ 1, 2 \] to sort of not equal \[ 1, 2 \]/);
		}
	}
});