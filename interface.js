(function () {
	// Enable memory check mode, this makes sure that constructor call correctly the parent classes
	Aria.memCheckMode = true;

	// Store here Aria Templates methods that are overridden
	var originalMethods = {
		classDefinition : Aria.classDefinition,
		beanDefinitions : Aria.beanDefinitions,
		interfaceDefinition : Aria.interfaceDefinition,
		// resourcesDefinition and tplScriptDefinition are just aliases to classDefinition
		loadClassDependencies : aria.core.ClassMgr.loadClassDependencies
	};

	var pendingClasses = {};
	var missingDependencies = {};
	var pendingTests = [];

	// Override mocha.run, before actually starting, load all test dependencies and define the tests
	var mochaRun = mocha.run;
	mocha.run = function () {
		// Start loading the classes here
		for (var path in pendingClasses) {
			if (pendingClasses.hasOwnProperty(path)) {
				pendingClasses[path].originalMethod.call(Aria, pendingClasses[path].definition);
			}
		}
		var loadDescription = {
			classes : missingDependencies.JS,
			templates : missingDependencies.TPL,
			resources : missingDependencies.RES,
			css : missingDependencies.CSS,
			tml : missingDependencies.TML,
			txt : missingDependencies.TXT,
			cml : missingDependencies.CML,
			oncomplete : function () {
				loadDefinitions(function (tests) {
					for (var i = 0; i < tests.length; i += 1) {
						describeTest(tests[i]);
					}
					globalAssertion();
				});
				mochaRun.apply(mocha, arguments);
			},
			onerror : function (dependencies) {
				// In case of errors downloading dependencies just define a failing suite
				describe("Loading dependencies", function () {
					it("should load dependencies correctly", function () {
						var invalid = [];
						for (var type in missingDependencies) {
							if (missingDependencies.hasOwnProperty(type) && missingDependencies[type]) {
								for (var i = 0; i < missingDependencies[type].length; i += 1) {
									if (!Aria.getClassRef(missingDependencies[type][i])) {
										invalid.push(missingDependencies[type][i]);
									}
								}
							}
						}
						expect().fail(function () {
							return "Unable to load test dependencies of classes\n  " + invalid.join("\n  ");
						});
					});
				});
				mochaRun.apply(mocha, arguments);
			},
			scope : this
		};

		// Now that all tests are ready to be defined, restore the original methods
		aria.core.ClassMgr.loadClassDependencies = originalMethods.loadClassDependencies;
		Aria.classDefinition = originalMethods.classDefinition;
		Aria.beanDefinitions = originalMethods.beanDefinitions;
		Aria.interfaceDefinition = originalMethods.interfaceDefinition;

		// Load test dependencies
		Aria.load(loadDescription);
	};

	// All test cases are added directly to the page, this means they'll call Aria.classDefinition,
	// redefine it to create again the asynchronous behavior needed by Aria Templates
	Aria.classDefinition = function (definition) {
		// class definitions might not have a $classpath
		if (!definition.$classpath) {
			definition.$classpath = (definition.$package ? definition.$package + "." : "") + definition.$class;
		}
		storePendingDefinition(definition, originalMethods.classDefinition, loadAndRegisterPossibleTest);
	};
	Aria.beanDefinitions = function (definition) {
		storePendingDefinition(definition, originalMethods.beanDefinitions, loadAndRegisterBean);
	};
	Aria.interfaceDefinition = function (definition) {
		storePendingDefinition(definition, originalMethods.interfaceDefinition, loadAndRegisterInterface);
	};
	function storePendingDefinition (definition, original, load) {
		// Not all class definitions are actual tests
		pendingClasses[definition.$classpath || definition.$package] = {
			definition : definition,
			waitsForSomething : false,
			waitsForPendingClass : [],
			loadClassArgs : [],
			originalMethod : original,
			loadCallback : load
		};
	}

	// The original method filters out dependencies and tries to load them before calling the complete
	// callback, override it to only extract dependencies.
	aria.core.ClassMgr.loadClassDependencies = function (path, dependencyMap, callback) {
		// Remember these arguments, I'll have to pass them to the original method later
		pendingClasses[path].loadClassArgs = arguments;

		// Filter any missing dependency
		for (var type in dependencyMap) {
			if (dependencyMap.hasOwnProperty(type)) {
				if (!missingDependencies[type]) {
					missingDependencies[type] = [];
				}
				var missingList = this.filterMissingDependencies(dependencyMap[type]);
				if (missingList) {
					pendingClasses[path].waitsForSomething = true;
					for (var i = 0; i < missingList.length; i += 1) {
						if (pendingClasses[missingList[i]]) {
							pendingClasses[path].waitsForPendingClass.push(missingList[i]);
						} else if (!aria.utils.Array.contains(missingDependencies[type], missingList[i])) {
							missingDependencies[type].push(missingList[i]);
						}
					}
				}
			}
		}

		if (!pendingClasses[path].waitsForSomething) {
			// This class doesn't have any dependency, just load it cause it might be needed by other classes
			pendingClasses[path].loadCallback(path, arguments);
		}
		// returning false tells the multi-loader that this loading is asynchronous
		return false;
	};

	// Once the class definition has all its dependencies met, it can be loaded. Only after that it's possible
	// to understand precisely whether this class extends from a TextCase or not
	function loadAndRegisterPossibleTest (path, args) {
		// calling the original method creates a loader for this class, so in case of error we get notified
		originalMethods.loadClassDependencies.apply(aria.core.ClassMgr, args);
		Aria.loadClass(path, path);
		if (isTestCase(path)) {
			pendingTests.push(path);
		}
		delete pendingClasses[path];
	}

	// Called once the bean definition is ready and doesn't have other dependencies
	function loadAndRegisterBean (path, args) {
		originalMethods.loadClassDependencies.apply(aria.core.ClassMgr, args);
		aria.core.JsonValidator.__loadBeans(path);
		delete pendingClasses[path];
	}

	// Called once the interface definition is ready
	function loadAndRegisterInterface (path, args) {
		originalMethods.loadClassDependencies.apply(aria.core.ClassMgr, args);
		aria.core.Interfaces.loadInterface(pendingClasses[path].definition);
		delete pendingClasses[path];
	}

	// Load recursively all classes that were pending only on other classes
	function loadDefinitions (callback) {
		// Each iteration should break some dependencies, I claim 4 is enough to break all of them
		for (var i = 4; i > 0; i -= 1) {
			for (var path in pendingClasses) {
				if (pendingClasses.hasOwnProperty(path)) {
					if (pendingClasses[path].waitsForPendingClass.length === 0 || !stillPendingOnOthers(pendingClasses[path].waitsForPendingClass)) {
						// be optimist, maybe the one I'm pending on was already loaded before in the loop
						pendingClasses[path].loadCallback(path, pendingClasses[path].loadClassArgs);
					}
				}
			}
		}
		// pendingClasses is not going to be empty in case of circular dependencies
		callback(pendingTests);
	}

	// Whether or not a class is waiting for classes that are still in the pending list
	function stillPendingOnOthers (list) {
		for (var i = 0; i < list.length; i += 1) {
			if (pendingClasses[list[i]]) {
				// Damn yes, the class has not been loaded yet
				return true;
			}
		}
		return false;
	}

	// A class is a Test Case only if it extends directly or from another class extending from aria.jsunit.TestCase
	function isTestCase (path) {
		var reference = Aria.getClassRef(path);
		return superclass(reference).is("aria.jsunit.TestCase");
	}

	// Iterate isTestCase on the parent class
	function superclass (reference) {
		var parent = reference.superclass;
		return {
			is : function (what) {
				if (!parent) {
					return false;
				} else if (what === parent.$classpath) {
					return true;
				} else {
					return superclass(parent.constructor).is(what);
				}
			}
		};
	}

	// This is the part where we actually define tests out of their class definition
	// 
	// A classpath becomes a suite containing
	// - another suite with all tests extracted from the test class
	// - a test to verify that everything was done without errors
	// 
	// One difference with respect to Aria Test Runner is that test functions receive a parameter,
	// `tester` that can be used to make assertions on the test execution.
	// 
	// `tester` is an event emitter and can be used for instance to assert that there are no errors
	// after the normal test cases has been destroyed.
	function describeTest (path) {
		// Describe a test suite -> corresponds to a single test case in Aria Templates
		describe(path, function () {
			var instance, logger, tester;
			try {
				// Logger instance, specific to this test
				logger = new aria.core.log.MochaLogAppender(path);
				// Mocha tester, the event emitter utility
				tester = aria.mocha.Tester(logger);
				// Test instance, needed now to extract the test methods
				instance = Aria.getClassInstance(path, tester);
				instance["aria:createdFromTest"] = path;
			} catch (ex) {
				logger.error(path, "Unhandled Exception in $constructor", "$constructor", ex);
				it("shouldn't fail when calling the test constructor", function () {
					tester.raise("end");
					expect(logger.messages.error).to.be.empty();
					logger.$dispose();
				});
			}

			if (instance) {
				describeTestMethods(instance, logger, tester);
			}
		});
	}

	function describeTestMethods (instance, logger, tester) {
		// Describe the test cases because I want to run some tests after
		describe("Test Cases", function () {
			// Do some sand-boxing before running this test
			before(function () {
				// The logger instance was created during definition, but it's only added here to avoid
				// getting messages from other tests
				aria.core.Log.addAppender(logger);
				instance.__logAppender = logger;
				instance._saveAppEnvironment();
				tester.raise("begin");
			});

			// Add all the test methods taken from the prototype
			for (var fnName in instance) {
				if (/^x?[tT]est/.test(fnName) && typeof instance[fnName] === "function") {
					if (fnName.charAt(0) === "T") {
						// Capital 'Test' means we only want to run this test
						it.only("should pass " + fnName, buildTestFunction(fnName, instance, tester));
					} else if (fnName.charAt(0) === "x") {
						// Test starting with x should be excluded
						it.skip("should pass " + fnName, buildTestFunction(fnName, instance, tester));
					} else {
						// Here we are in a standard 'test'
						it("should pass " + fnName, buildTestFunction(fnName, instance, tester));
					}
				} else if (fnName === "setUp") {
					beforeEach(buildFixture(instance[fnName], instance));
				} else if (fnName === "tearDown") {
					afterEach(buildFixture(instance[fnName], instance));
				}
			}

			// Do some cleaning also after every test method ends
			afterEach(function () {
				instance.clearLogs();
				instance.unregisterObject();
				for (var id in Aria.__undisposedObjects) {
					if (Aria.__undisposedObjects.hasOwnProperty(id) && !Aria.__undisposedObjects[id]["aria:createdFromTest"]) {
						Aria.__undisposedObjects[id]["aria:createdFromTest"] = instance.$classpath + "." + instance._currentTestName;
					}
				}
				tester.raise("after_" + instance._currentTestName.slice(0, -2));
				instance._currentTestName = null;
			});

			// After all tests we can dispose it and do some cleaning
			after(function () {
				instance.unregisterObject();
				instance._restoreAppEnvironment();
				if (aria.core.Timer._numberOfCallbacks > 0) {
					logger.error(instance.$classpath, aria.core.Timer._numberOfCallbacks + " callback(s) remaining after test executions", "$callbacks");
				}
				aria.core.Timer.callbacksRemaining();

				try {
					// we might have errors in the dispose as well
					instance.$dispose();
				} catch (ex) {
					logger.error(instance.$classpath, "Unhandled Exception in $dispose", "$dispose", ex);
				}
			});
		});

		describe("Checks after running test cases", function () {
			it("shouldn't raise errors", function () {
				// Let the test do some assertions on what happened after its death
				tester.raise("end");
				expect(logger.messages.error).to.be.empty();
			});
		});

		after(function () {
			logger.$dispose();
		});
	}

	// This holds the assertion that should be run before or after the main test suite
	// Being run only once in the whole campaign it's the place to check framework initialization or disposal
	function globalAssertion () {
		after(function () {
			var disposeInfo = Aria.dispose();
			var not = [];
			for (var key in disposeInfo.notDisposed) {
				if (disposeInfo.notDisposed.hasOwnProperty(key)) {
					var object = disposeInfo.notDisposed[key];
					not.push(object.$classpath + " in " + object["aria:createdFromTest"]);
				}
			}
			if (not.length > 0) {
				throw new Error("Undisposed objects:\n  " + not.join("\n  "));
			}
		});
	}

	function buildTestFunction (testName, instance, tester) {
		var testFunction;
		if (/^testAsync/.test(testName)) {
			testFunction = function (callback) {
				instance._currentTestName = testName + "()";
				overrideTestEnd(testName, instance, callback);
				tester.raise("before_" + testName);
				instance[testName].call(instance);
			};
		} else {
			testFunction = function () {
				instance._currentTestName = testName + "()";
				tester.raise("before_" + testName);
				instance[testName].call(instance);
			};
		}
		// For a better report in the viewer, we want to display the original code, not the generated method
		testFunction.toString = function () {
			return instance[testName].toString();
		};
		return testFunction;
	}

	function buildFixture (fn, instance) {
		return function () {
			fn.call(instance);
		};
	}

	function overrideTestEnd (name, instance, callback) {
		if (!instance.notifyTestEnd.override) {
			instance.notifyTestEnd = function (testName) {
				if (/\(\)$/.test(testName)) {
					// testName ends with (), this should be wrong but it's done by callAsyncMethod in
					// aria.jsunit.TestCase which is calling notifyTestEnd(this._currentTestName)
					// unless that is fixed, this needs to stay here
					testName = testName.slice(0, -2);
				}
				if (testName && testName in this.notifyTestEnd.callbacks) {
					var back = this.notifyTestEnd.callbacks[testName];
					delete this.notifyTestEnd.callbacks[testName];
					back();
				} else {
					var error;
					// Try to guess which test is running
					var runningTest = this._currentTestName.slice(0, -2);
					if (runningTest && this.notifyTestEnd.callbacks[runningTest] && this.__logAppender) {
						error = new Error("Calling notifyTestEnd for test '" + testName + "' while running '" + runningTest + "'.");
						this.__logAppender.error(this.$classpath, error.message, "$notifyTestEnd", error);
						this.notifyTestEnd.callbacks[runningTest]();
					} else {
						// No better option than letting this test fail (it'll wait for a timeout)
						error = new Error("Calling notifyTestEnd for unknown test '" + testName + "'.");
						this.fail(error);
					}
				}
			};
			instance.notifyTestEnd.override = true;
			instance.notifyTestEnd.callbacks = {};
		}
		instance.notifyTestEnd.callbacks[name] = callback;
	}
})();