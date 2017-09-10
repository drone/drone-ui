module.exports = {
	"extends": [
		"standard",
		"prettier"
	],
	"plugins": [
		"prettier"
	],
	"env": {
		"browser": true,
		"node": true
	},
	"rules": {
		"prettier/prettier": [
			"error",
			{
				"trailingComma": "all",
				"useTabs": true
			}
		]
	}
};

