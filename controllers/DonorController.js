const customReferences = require('../references/customReferences');
const formData = customReferences.multer();
const donorModel = require('../model/donorModel');

customReferences.app.post(
  "/saveDonationDetails",
  formData.none(),
  async (request, response) => {
    try {
      const { donorName, donorPhoneNumber, foodDetails, distributionLocation, distributionDateTime ,userId} = request.body;
console.log('donatedData',request.body)
      // Create a new donor model
      const newDonor = new donorModel({
        donorName,
        donorPhoneNumber,
        foodDetails,
        distributionLocation,
        distributionDateTime,
        userId:userId, // Assuming user ID is available in request.user.id
      });

      // Save the donor details to the database
      const savedDonor = await newDonor.save();

      if (savedDonor) {
        response.json({
          save: true,
          message: "Donation details saved successfully.",
          newDonor: savedDonor,
        });
      } else {
        response.json({ save: false, message: "Failed to save donation details." });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error." });
    }
  }
);
customReferences.app.post(
  "/getDonationData",
  formData.none(),
  async (request, response) => {
    try {
      const { userId } = request.body;

      const donationData = await donorModel.find();

      response.json({
        success: true,
        donationData,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error." });
    }
  }
);