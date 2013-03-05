Aria.classDefinition({
	$classpath : "Fixtures",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		firstTest :true,

		countSetUp : 0,

		countTearDown : 0,

		setUp : function () {
			this.countSetUp += 1;
		},

		tearDown : function () {
			this.countTearDown += 1;
		},

		testOne : function () {
			this.assertFunction();
		},

		testTwo : function () {
			this.assertFunction();
		},

		assertFunction : function () {
			if (this.firstTest) {
				this.firstTest = false;
				this.assertEquals(this.countSetUp, 1);
				this.assertEquals(this.countTearDown, 0);
			} else {
				this.assertEquals(this.countSetUp, 2);
				this.assertEquals(this.countTearDown, 1);
			}
		}
	}
});
