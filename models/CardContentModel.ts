import mongoose from "mongoose";

const CardsSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: false },
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
});

const ContentSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: false },
  block_type: { type: String, required: true },
  cards: [CardsSchema],
});

const CardContentSchema = new mongoose.Schema({
  page: { type: String, required: true },
  content: [ContentSchema],
});

const CardContent =
  mongoose.models.card_content ||
  mongoose.model("card_content", CardContentSchema, "card_contents");

export default CardContent;
