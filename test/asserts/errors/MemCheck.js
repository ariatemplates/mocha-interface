Aria.classDefinition({
	$classpath : "errors.MemCheck",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["resources.DontCallParentConstructor", "resources.WrongParentConstructor"],
	$prototype : {
		testParentNotCalled : function (tester) {
			Aria.getClassInstance("resources.DontCallParentConstructor").$dispose();

			tester.on("end", function () {
				tester.hasError(Aria.PARENT_NOTCALLED);
			});
		},

		testWrongParentCall : function (tester) {
			Aria.getClassInstance("resources.WrongParentConstructor").$dispose();

			tester.on("end", function () {
				tester.hasError(Aria.WRONGPARENT_CALLED);
			});
		}
	}
});
