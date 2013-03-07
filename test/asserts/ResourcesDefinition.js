Aria.classDefinition({
	$classpath : "ResourcesDefinition",
	$extends : "aria.jsunit.TestCase",
	$resources : {
		responses : "types.Resources"
	},
	$prototype : {
		testLoadAResource : function () {
			expect(this.responses.yes).to.be(true);
		}
	}
});
