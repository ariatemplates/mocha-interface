Aria.beanDefinitions({
	$package : "types.Beans",
	$description : "Try to load this bean, should work",
	$namespaces : {
		"j" : "aria.core.JsonTypes"
	},
	$beans : {
		"Stuff" : {
			$type : "j:Object",
			$description : "Some generic stuff",
			$properties : {
				"name" : {
					$type : "j:String",
					$description : "Name of the stuff",
					$mandatory : true
				}
			}
		}
	}
});
