/**
 * Classes can be defined as well as by their class and package, instead of classpath
 */
Aria.classDefinition({
	$class : "ClassPackage",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["resources.NoClasspath"],
	$prototype : {
		testMeetingDependencies : function () {
			// I expect it to work without errors
			Aria.getClassInstance("resources.NoClasspath").mySelf().$dispose();
		}
	}
});
