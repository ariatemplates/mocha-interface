Aria.classDefinition({
	$classpath : "aria.core.log.MochaLogAppender",
	$constructor : function (test) {
		this.test = test;

		this.messages = {
			debug : [],
			info : [],
			warn : [],
			error : []
		};
	},
	$destructor : function () {
		for (var i = aria.core.Log._appenders.length - 1; i >= 0; i -= 1) {
			if (aria.core.Log._appenders[i] === this) {
				aria.core.Log._appenders.splice(i, 1);
			}
		}
	},
	$prototype : {
		debug : function (className, msg, msgText, o) {
			this.messages.debug.push({
				className : className,
				message : msg,
				id : msgText,
				object : o
			});
		},
		info : function (className, msg, msgText, o) {
			this.messages.info.push({
				className : className,
				message : msg,
				id : msgText,
				object : o
			});
		},
		warn : function (className, msg, msgText, o) {
			this.messages.warn.push({
				className : className,
				message : msg,
				id : msgText,
				object : o
			});
		},
		error : function (className, msg, msgText, e) {
			this.messages.error.push({
				className : className,
				message : msg,
				id : msgText,
				object : e
			});
		}
	}
});