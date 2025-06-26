const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  S_title: String,
  S_description: String,
  S_content: String, // file path or link
  S_type: { type: String, enum: ['video', 'pdf', 'link'], required: true },
});

const courseModel = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    C_educator: {
      type: String,
      required: [true, "name is required"],
    },
    C_title: {
      type: String,
      required: [true, "C_title is required"],
    },
    C_categories: {
      type: String,
      required: [true, "C_categories: is required"],
    },
    C_price: {
      type: String,
    },
    C_description: {
      type: String,
      required: [true, "C_description: is required"],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    published: {
      type: Boolean,
      default: false,
    },
    sections: [sectionSchema],
    enrolled: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    previewVideo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const courseSchema = mongoose.model("course", courseModel);

module.exports = courseSchema;
