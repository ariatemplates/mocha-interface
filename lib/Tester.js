Aria.nspace("aria.mocha.Tester", true);
aria.mocha.Tester = function (logger) {
	var listeners = {};

	return {
		on : function (event, callback) {
			if (!listeners[event]) {
				listeners[event] = [];
			}
			listeners[event].push(callback);
		},
		raise : function (event) {
			if (listeners[event]) {
				for (var i = 0; i < listeners[event].length; i += 1) {
					listeners[event][i].call(this);
				}
			}
		},
		hasError : function (message) {
			for (var i = logger.messages.error.length - 1; i >= 0; i -= 1) {
				var error = logger.messages.error[i];
				if (error.id === message || (error.object && message.test && message.test(error.object.message))) {
					logger.messages.error.splice(i, 1);
					return true;
				}
			}
			logger.error(logger.test, "Expected message '" + message.toString() + "' not found in logs", "$hasError");
			return false;
		}
	};
};