Aria.classDefinition({
	$classpath : "Dependencies",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["resources.DataClass"],
	$prototype : {
		testDependencyReady : function () {
			expect(resources.DataClass.one).to.be(1);
			expect(resources.DataClass.two).to.be(2);
			expect(aria.utils.Xml).to.be.ok();
			expect(resources.DataClass.isDead()).to.be(true);
		}
	}
});
