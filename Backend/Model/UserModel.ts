import mongoose, { Document, Schema } from "mongoose";

// Enum for funding stages
enum FundingStage {
  PreSeed = "Pre-Seed",
  Seed = "Seed",
  SeriesA = "Series A",
  SeriesB = "Series B",
  SeriesC = "Series C",
  Later = "Later Stage"
}

// Interface to define the structure of a User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  userType: "creator" | "business";
  audienceSize?: number;
  contentTypes?: string[];
  platforms?: string[];
  companyName?: string;
  industry?: string;
  fundingStage?: FundingStage;
  equityOfferRange?: {
    min: number;
    max: number;
  };
  bio?: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["creator", "business"], required: true },
  
  // Creator-specific fields
  audienceSize: { type: Number },
  contentTypes: [String],
  platforms: [String],
  
  // Business-specific fields
  companyName: { type: String },
  industry: { type: String },
  fundingStage: { type: String, enum: Object.values(FundingStage) },
  
  // Common fields
  equityOfferRange: {
    min: { type: Number },
    max: { type: Number }
  },
  bio: { type: String },
  
  // Administrative
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true,
  versionKey: false
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export { UserModel, IUser, FundingStage };