Aria.classDefinition({
	$classpath : "errors.ExceptionInDispose",
	$extends : "aria.jsunit.TestCase",
	$constructor : function (tester) {
		tester.on("end", function () {
			tester.hasError(/This is bad/);
			// Since there was an error in the dispose, this will make Aria.dispose() report a not disposed object
			for (var name in Aria.__undisposedObjects) {
				if (Aria.__undisposedObjects.hasOwnProperty(name)) {
					if (Aria.__undisposedObjects[name].$classpath === "errors.ExceptionInDispose") {
						delete Aria.__undisposedObjects[name];
						break;
					}
				}
			}
		});
		this.$TestCase.constructor.call(this);
	},
	$destructor : function () {
		throw new Error("This is bad");
	},
	$prototype : {
		testAfterDeath : function () {
			expect("The error is in the $destructor").to.be.a("string");
		}
	}
});
