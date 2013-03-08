Aria.classDefinition({
	$classpath : "errors.MemCheck",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["resources.DontCallParentConstructor", "resources.WrongParentConstructor"],
	$constructor : function (tester) {
		tester.on("after_testParentNotCalled", function () {
			tester.hasError(Aria.PARENT_NOTCALLED);
		});

		tester.on("after_testWrongParentCall", function () {
			tester.hasError(Aria.WRONGPARENT_CALLED);
		});
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testParentNotCalled : function () {
			Aria.getClassInstance("resources.DontCallParentConstructor").$dispose();
		},

		testWrongParentCall : function () {
			Aria.getClassInstance("resources.WrongParentConstructor").$dispose();
		}
	}
});
