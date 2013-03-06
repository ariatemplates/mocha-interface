Aria.classDefinition({
	$classpath : "errors.ExceptionInDispose",
	$extends : "aria.jsunit.TestCase",
	$destructor : function () {
		throw new Error("This is bad");
	},
	$prototype : {
		// This test register a callback on the tester in order to run asserts after the test end
		testAfterDeath : function (tester) {
			expect("The error is in the $destructor").to.be.a("string");

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
		}
	}
});
