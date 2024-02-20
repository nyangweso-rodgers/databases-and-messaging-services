import mongoose from "mongoose";

const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
  },
  employment_type: {
    required: true,
    enum: ["Full-time", "Contract", "Part-time"],
  },
  company_name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    enum: ["Active", "Inactive"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  date_of_joining: {
    type: Date,
    required: true,
  },
  probation_end_date: {
    type: Date,
    required: true,
  },
  contact_details: [
    {
      mobile: {
        type: String,
        required: true,
      },
      preferred_email: {
        type: String,
      },
      company_email: {
        type: String,
        required: true,
      },
      personal_email: {
        type: String,
        required: true,
      },
    },
  ],
  department_details: [
    {
      department: {
        type: String,
        enum: [""],
      },
      designation: {
        type: String,
        enum: [
          "Sales Supervisor",
          "Area Manager",
          "CEO",
          "Head Of Department",
          "Sales Agent",
          "Driver",
        ],
      },
      reports_to: {
        type: String,
        required: true,
      },
      reports_to_designation: {
        type: String,
        enum: [
          "Sales Supervisor",
          "Area Manager",
          "CEO",
          "Head Of Department",
          "Sales Agent",
          "Driver",
        ],
      },
      skip_line_manager: {
        type: String,
        required: true,
      },
      skip_line_manager_designation: {
        type: String,
        required: true,
        enum: [
          "Sales Supervisor",
          "Area Manager",
          "CEO",
          "Head Of Department",
          "Sales Agent",
          "Driver",
        ],
      },
    },
  ],
  personal_details: [
    {
      nationality: { type: String, required: true },
      national_id: { type: String, required: true },
      nssf_no: { type: string, required: true },
      tax_id: { type: string, required: true },
    },
  ],
  add_comments: {
    type: String,
  },
});

const employee = model("employee", employeeSchema);
export default employee;