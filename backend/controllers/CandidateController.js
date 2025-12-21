import Candidates from "../models/Candidates.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { validateCandidate } from "../validators/CandidateValidator.js";

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidates.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidate = await Candidates.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidate", error });
  }
};


export const addCandidate = async (req, res) => {
  try {
    const { success, error, data } = validateCandidate(req.body);
    if (!success) {
      res.status(400).json({
        message: "Invalid request data",
        errors: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }
    const candidateData = data;
    const resume = req.file;
    let result;
    if (resume) {
      result = await uploadOnCloudinary(resume.path);
    
    if (!result) {
      return res.status(500).json({ message: "Failed to upload resume" });
    }
    candidateData.resumeFile = result.secure_url;
    candidateData.resumeFileName = resume.filename;
    candidateData.resumeFileType = resume.mimetype.split("/").pop();
  }
    const newCandidate = new Candidates(candidateData);
    await newCandidate.save();
    res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: "Error adding candidate", error });
  }
};


export const updateCandidateData = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { success, error, data } = validateCandidate(req.body, "update");
    if (!success) {
      res.status(400).json({
        message: "Invalid request data",
        errors: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }
    const updatedData = data;
    const resume = req.file;
    let result;
    if (resume) {
      result = await uploadOnCloudinary(resume.path);
      if (!result) {
      return res.status(500).json({ message: "Failed to upload resume" });
    }
      updatedData.resumeFile = result.secure_url;
      updatedData.resumeFileName = resume.filename;
      updatedData.resumeFileType = resume.mimetype.split("/").pop();
    }
    
    const updatedCandidate = await Candidates.findByIdAndUpdate(
      candidateId,
      updatedData,
      { new: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
   res
  .status(200)
  .json({ message: "Candidate updated successfully", candidate: updatedCandidate });

  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const deletedCandidate = await Candidates.findByIdAndDelete(candidateId);
    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error });
  }
};
