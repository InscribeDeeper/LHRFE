const express = require("express");
const router = express.Router();
const verifier = require("../data/verify");
const data = require("../data");
const { furniture } = require("../config/mongoCollections");
const userData = data.users;
const commentData = data.comments;
const furnitureData = data.furniture;
const rentalData = data.rental;

router.get("/", async (req, res) => {
	const userName = req.session.user;
	console.log("private route");
	console.log(userName);
	myUser = await userData.getUserByUserName(userName);
	// myUser._id

	//###########################
	// My Reviews History
	// this.name; this.type, this.text
	//###########################
	let reviewHistory = [];
	const myComments = myUser.comments_id || [];
	for (let eachCommmentID of myComments) {
		eachCommment = await commentData.getCommentById(eachCommmentID);

		current = {};
		current_furniture_id = await commentData.getFurnitureIDbyCommentID(eachCommment._id);
		current_rental_id = await commentData.getRentalIDbyCommentID(eachCommment._id);

		if (current_furniture_id) {
			item_type = "Furniture";
			current_furniture = await furnitureData.getFurnitureById(current_furniture_id);
			item_name = current_furniture.name;
			item_id = current_furniture._id;
		} else {
			item_type = "Rental";
			current_rental = await furnitureDrentalDataata.getRentalById(current_rental_id);
			item_name = current_rental.name;
			item_id = current_rental._id;
		}

		current._id = item_id;
		current.name = item_name;
		current.type = item_type;
		current.text = eachCommment.comment;
		reviewHistory.push(current);
	}

	//###########################
	// My ownedFurnitures
	// this.name; this.type, this.text
	//###########################
	let ownedFurnitures = [];
	const myFurnitures = myUser.furniture_id || [];
	for (let eachFurnitureID of myFurnitures) {
        current = {};
		current_furniture = await furnitureData.getFurnitureById(eachFurnitureID);
        current.likes = current_furniture.likes
        current.num_comments = current_furniture.comments_id.length

	}
	//###########################
	// My favoritedFurnitures
	// this.name; this.type, this.text
	//###########################
	let favoritedFurnitures = [];
	const ownedFurnituresIdList = myUser.furniture_id || [];
	for (let eachCommmentID of myComments) {
		eachCommment = await commentData.getCommentById(eachCommmentID);

		current = {};
		current_furniture = await commentData.getFurnitureIDbyCommentID(eachCommment._id);
		current_rental = await commentData.getRentalIDbyCommentID(eachCommment._id);
		item = current_furniture || current_rental;
		current.name = item.name;
		current.type = current_furniture ? "Furniture" : "Rental";
		current.text = eachCommment.comment;
		reviewHistory.push(current);
	}

	return res.render("users/myProfile", {
		authenticated: true,
		partial: "user-info-script",
		title: "Your Profile",
		user: myUser,
		favRestaurants: myUser.email,
		reviews: myUser.selfSummary,
	});
});

module.exports = router;
