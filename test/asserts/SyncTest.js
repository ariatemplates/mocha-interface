/**
 * This test verifies that all positive and synchronous assertion run fine
 */
Aria.classDefinition({
	$classpath : "SyncTest",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testAssertTrue : function () {
			this.assertTrue(true);
		},

		testAssertFalse : function () {
			this.assertFalse(false);
		},

		testAssertEquals : function () {
			this.assertEquals(1, 1);
		},

		testAssertNotEquals : function () {
			this.assertNotEquals(1, "1");
		},

		testJsonContains : function () {
			this.assertJsonContains({
				one : 1,
				two : 2,
				three : 3
			}, {
				two : 2,
				one : 1
			});
		},

		testAssertJsonEquals : function () {
			this.assertJsonEquals({
				a : {
					b : "c"
				}
			}, {
				a : {
					b : "c"
				}
			});

			this.assertJsonEquals([1, 2, 3], [1, 2, 3]);
		},

		testAssertJsonNotEquals : function () {
			this.assertJsonNotEquals({
				a : 1
			}, {
				a : 2
			});

			this.assertJsonNotEquals([1, 2], [2, 1]);
		}
	}
});