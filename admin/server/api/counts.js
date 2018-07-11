var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var counts = {};
	async.each(keystone.lists, function (list, next) {
		var countfn = function (err, count) {
			counts[list.key] = count;
			next(err);
		};
		if (list.model.countDocuments) {
			// mongoose 5.2 and above
			list.model.countDocuments(countfn);
		} else {
			// mongoose 5 and below
			list.model.count(countfn);
		}
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};
