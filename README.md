[Mocha](https://github.com/visionmedia/mocha) "interface" to write tests using [Aria Templates](https://github.com/ariatemplates/ariatemplates) style of `aria.jsunit.TestCase`.

Note that this is not exactly a mocha interface, but it simply converts Aria Templates tests in an equivalent BDD syntax.

The Aria Templates testing solution is originally designed for applications using Aria Templates. 
This interface allows to execute Aria Templates tests together with other less specialized unit tests, written in mocha and run in any runner that supports it.

# Usage

This tool has to be used together with mocha and Aria Templates. So first set up mocha normally either using an HTML launcher or tools like [testacular](https://github.com/testacular/testacular) or [testem](https://github.com/airportyh/testem).

Include all files inside `lib` folder and then `interface.js`

For a simple launcher page have a look at [index.html](https://raw.github.com/ariatemplates/mocha-interface/master/index.html) or at [testacular.conf.js](https://raw.github.com/ariatemplates/mocha-interface/master/test/testacular.conf.js) for the testacular configuration file.

# Writing tests

The base class for any Aria Templates test is `aria.jsunit.TestCase`. On top of basic assertions it allows to assert logs and events, it provides mocking and sandboxing. More advanced classes help in testing more specific use cases.

* `TestCase` Ideal for pure JavaScript classes that don't need DOM interaction.
* `ModuleCtrlTestCase` Provides helper methods to instantiate and test module controllers.
* `WidgetTestCase` Better suited for testing widgets as it provides a controlled environment where to safely create widgets without the need of real template
* `TemplateTestCase` Base class for testing the DOM. Loads a template in a test area and provide methods to simulate the user interaction.
* `RobotTestCase` Advanced class for DOM testing. It extends from `TemplateTestCase` and in addition uses a Java applet to control the mouse and keyboard for a true interaction.

## TestCase

Here is an example of unit test class

````js
Aria.classDefinition({
	$classpath : "SyncTest",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testAssertTrue : function () {
			this.assertTrue(false, "This assertion is false");
		}
	}
});
````

A Test Case (cf. [API doc](http://ariatemplates.com/aria/guide/apps/apidocs/#aria.jsunit.TestCase)) will usually feature several single test methods. All tests are supposed to be completely independent from each other, and the order in which they are executed should not be taken into consideration.

When running a TestCase, all the methods defined in the prototype and with a name starting with test will be considered as test methods. It is mandatory to follow this naming convention.

The scope of a test method is the test case and no return value is expected. The status of the test is determined by the result of the various asserts made during this test. A test method containing no failing assert is considered as successful if no JavaScript error was thrown during its execution.

### Assert

The possible assertions that can be done from within a test case are defined in [`aria.jsunit.Assert`](http://ariatemplates.com/aria/guide/apps/apidocs/#aria.jsunit.Assert) and are

* `assertTrue` / `assertFalse` Test if a value is true or false

````js
this.assertTrue("a truthy value");  // assert fail
````

* `assertEquals` / `assertNotEquals` Test that two values are strictly equal

````js
var number = 12;
this.assertEquals(number, 12);   // true
this.assertEquals(number, "12"); // false
````

* `assertJsonEquals` / `assertJsonNotEquals` Test for deep equality of objects / array

````js
this.assertEquals([1, 2], [1, 2]); // false
this.assertJsonEquals([1, 2], [1, 2]); // true
this.assertJsonEquals({
	one : 1,
	two : 2
}, {
	two : 2,
	one : 1
});    // true
````

* `assertJsonContains` Assert that an object is included in a bigger container

````js
var serverResponse = {
	one : 1,
	two : 2,
	// other values
	end : "eventually"
};
this.assertJsonContains(serverResponse, {
	one : 1
});   // true
````

* `assertLogsEmpty` Test that no class logged an error message

* `assertErrorInLogs` Test that a precise error has been logged

````js
someClass.$raiseError("Error while having fun");
this.assertErrorInLogs("Error while having fun");   // true
````

Error messages for which a corresponding assertion is not performed will make the test fail

* `fail` Explicitly let the test fail with a given message

````js
if (number > 10) {
	this.fail("I'd like a smaller number");
}
````

### Asynchronous testing

Asynchronous tests are a special kind of test methods, and their name should start with `testAsync`

The easiest way to do an asynchronous test is to directly call the asynchronous method, passing a callback defined in the Test Case. This callback will then be responsible of notifying the tester when the test is finished.

The callback can be defined in the prototype of the Test Case, but in this case, make sure its name doesn't start with `test`, otherwise it will be picked up and executed on its own as a test method.

To notify the test runner, `aria.jsunit.TestCase` provides the `notifyTestEnd` method.

````js
Aria.classDefinition({
	$classpath : "AsyncTest",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		testAsyncMethod : function () {
			someClass.callMeLater({
				fn : this.methodCallback,
				scope : this
			});
		},

		methodCallback : function () {
			this.assertTrue(true);
			this.notifyTestEnd("testAsyncMethod");
		}
	}
});
````

### Fixtures : `setUp` / `tearDown`

If several tests in a single test case are using the same kind of objects in their tests, it can be interesting to define the `setUp` and `tearDown` methods in the `$prototype` of the `TestCase`.
These two methods are called before and after each test method.

````js
Aria.classDefinition({
	$classpath : "Fixtures",
	$extends : "aria.jsunit.TestCase",
	$prototype : {
		countSetUp : 0,      // 2 at the end of testing
		countTearDown : 0,   // 2 at the end of testing

		setUp : function () {
			this.countSetUp += 1;
		},

		tearDown : function () {
			this.countTearDown += 1;
		},

		testOne : function () {},

		testTwo : function () {}
	}
});
````


# Contributing

To contribute, clone the project and then

    npm install
    testacular start

There's already a list of tests inside `test` folder. Just create a new test case and share your code.
