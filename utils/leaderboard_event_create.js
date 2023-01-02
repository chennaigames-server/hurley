const dbconn = require('../common/inc.dbconn');
    const dbobj = new dbconn();


	create_event(dbobj,"DAILY",1);

async function create_event(dbobj, event_type, mode) {
	let query_parameter = {};
	let event_id = 1;
	if (event_type === 'HOURLY') {
		/* CREATING CURRENT DATE OBJECT */
		let start = new Date();
		let end = new Date();

		/* SET HOURS TO START AND END LIMIT */
		start.setUTCMinutes(0, 0, 0);
		end.setUTCMinutes(59, 59, 999);

		/* GETTING EVENT VALUE BY START HOUR AND END HOUR */
		query_parameter = { start_date: start, end_date: end };

	}
	else if (event_type === 'DAILY') {
		/* CREATING CURRENT DATE OBJECT */
		let start = new Date();
		let end = new Date();

		/* SET HOURS TO START AND END LIMIT */
		start.setUTCHours(0, 0, 0, 0);
		end.setUTCHours(23, 59, 59, 999);


		query_parameter = { start_date: start, end_date: end };
	}
	else if (event_type === 'WEEKLY') {
		/* CREATING CURRENT DATE OBJECT */
		let start = new Date();
		let end = new Date();

		/* SET HOURS TO START AND END LIMIT */
		start.setHours(0, 0, 0, 0);
		end.setHours(23, 59, 59, 999);

		query_parameter = { start_date: start_of_week(start), end_date: end_of_week(end) };
	}
	else {
		return 'Invalid Event Type';
	}
	query_parameter.mode = mode;

	console.log(query_parameter);
	let get_exist_event = await dbobj.db.collection('app_rank_master').find(query_parameter).limit(1).toArray();
console.log(get_exist_event);
// return false

	if (get_exist_event.length > 0) {
		event_id = get_exist_event[0].event_id;
		/* EVENT ALREADY EXIST FOR DURATION */
	}
	else {
		/* EVENT DOESN'T EXIST NEED TO CREATE ONE */
		event_id = 1;
		/* GET LAST EVENT ID FROM DB COLLECTION */
		let get_last_event = await dbobj.db.collection('app_rank_master').find({ mode: mode }).sort({ _id: -1 }).limit(1).toArray();

		(get_last_event.length > 0) ? event_id = get_last_event[0].event_id + 1 : event_id = event_id;

		let insert_data = {
			event_id: event_id,
			group_id: event_type,
			mode: mode,
			event_name: format_date(query_parameter.start_date, event_type),
			start_date: query_parameter.start_date,
			end_date: query_parameter.end_date,
			crd_on: new Date(),
			stat: 'A'
		};

		/* INSERTING NEW EVENT DATA */
		 await dbobj.db.collection('app_rank_master').insertOne(insert_data);
		console.log(insert_data);
	}
	console.log(event_id);
	return event_id;
}


function format_date(date, event_type) {
	let formated_string = 'CURRENT EVENT';
	if (event_type == 'DAILY') {
		let month_name = date.toLocaleString('default', { month: 'long' });  // Get Month full Name..
		let day = String(date.getUTCDate()).padStart(2, "0");   // Date Starts with 0
		formated_string = month_name + "-" + day + "-" + (date.getUTCFullYear());
	}
	else if (event_type === 'HOURLY') {
		let hours = date.getUTCHours();
		let minutes = date.getUTCMinutes();
		let ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		formated_string = (date.getUTCDate()) + "-" + (date.getMonth() + 1) + "-" + (date.getUTCFullYear()) + ' ' + hours + ':' + minutes + '' + ampm;
	}
	return formated_string;
}

function start_of_week(date) {
	let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
	return new Date(date.setDate(diff));
}

function end_of_week(date) {
	let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 7);
	return new Date(date.setDate(diff));

}