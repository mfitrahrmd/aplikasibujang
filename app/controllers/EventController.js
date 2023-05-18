exports.addEventPage = (req, res, next) => {
	if (!res.locals.isAuthenticated) res.redirect('/sign-in');

	res.render('event/add', {pageTitle: 'Add Event'});
};

exports.addEvent = (req, res, next) => {
	if (!res.locals.isAuthenticated) res.redirect('/sign-in');

	console.log(req.body);
}