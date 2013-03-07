Aria.classDefinition({
	$classpath : "BeanDefinitions",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["types.Beans"],
	$prototype : {
		testLoadABean : function () {
			var checkEnabled = aria.core.JsonValidator._options.checkEnabled;
			aria.core.JsonValidator._options.checkEnabled = true;

			expect(aria.core.JsonValidator.check({
				name : "object"
			}, "types.Beans.Stuff", false)).to.be(true);
			aria.core.JsonValidator._options.checkEnabled = checkEnabled;
		}
	}
});
