const mongoose = require("mongoose");
const Consultation = require("../../models/cosultantModel");
const Email = require("../../utils/email");
const catchAsync = require("../../utils/error")
const isDbConnected = () =>
  mongoose.connection && mongoose.connection.readyState === 1;

exports.getAllConsultations = async (req, res) => {
  try {
    const { search, status, page, limit } = req.query;

    if (isDbConnected()) {
      const queryObj = {};
      if (search) {
        queryObj.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
        ];
      }
      if (status) {
        queryObj.status = status;
      }

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 50;
      const skip = (pageNum - 1) * limitNum;

      const [consultations, total] = await Promise.all([
        Consultation.find(queryObj)
          .sort("-createdAt")
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Consultation.countDocuments(queryObj),
      ]);

      return res.status(200).json({
        status: "success",
        success: true,
        count: consultations.length,
        total,
        consultations,
        data: { consultations, total },
      });
    }

    res.status(200).json({
      status: "success",
      success: true,
      count: 0,
      total: 0,
      consultations: [],
      data: { consultations: [], total: 0 },
    });
  } catch (err) {
    console.error("Error retrieving consultations:", err);
    res
      .status(500)
      .json({
        status: "error",
        error: "Failed to retrieve consultant requests",
      });
  }
};

exports.getConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "fail", error: "Invalid consultation ID" });
    }

    if (isDbConnected()) {
      const consultation = await Consultation.findById(id).lean();
      if (!consultation) {
        return res
          .status(404)
          .json({ status: "fail", error: "Consultant request not found" });
      }

      

      return res.status(200).json({
        status: "success",
        success: true,
        consultation,
        data: { consultation },
      });
    }

    

    res
      .status(404)
      .json({ status: "fail", error: "Consultant request not found" });
  } catch (err) {
    console.error("Error fetching consultation detail:", err);
    res
      .status(500)
      .json({
        status: "error",
        error: "Failed to retrieve consultation detail",
      });
  }
};

exports.updateConsultationStatus = catchAsync(async (req, res) => {

     const { id } = req.params;
      const { status, internalNotes ,notes } = req.body;

       if (!mongoose.Types.ObjectId.isValid(id)) {
       return res
        .status(400)
        .json({ status: "fail", error: "Invalid consultation ID" });
       }

     

         const updateFields = {};
       if (status) updateFields.status = status;
       if (internalNotes !== undefined) updateFields.internalNotes = internalNotes;
       if (notes !== undefined && internalNotes === undefined)
      updateFields.internalNotes = notes;

    
      const updated = await Consultation.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res
          .status(404)
          .json({ status: "fail", error: "Consultant request not found" });
      }

     
      
      
      // Send status update email to the user (non-blocking — update succeeds even if email fails)
      try {
        if (status==='confirmed' && updated.email) {
          const emailUser = {
            email: updated.email,
            fullName: updated.fullName || "Traveler",
          };
          await new Email(emailUser).sendConsultationEmail(status, notes );

          res.status(200).json({
            status: "success",
            success: true,
            consultation: updated,
            data: { consultation: updated },
          });
        }else{
          res.status(200).json({
            status: "success",
            success: true,
            consultation: updated,
            data: { consultation: updated },
          });
        }
      }
      catch (emailErr) {
        console.warn("Consultation status email failed (non-fatal):", emailErr.message);

        res.status(401).json({
          status: "error",
          success: false,
        });
      }


      


      
});
