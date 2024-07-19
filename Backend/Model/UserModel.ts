import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Enum for funding stages
enum FundingStage {
  PreSeed = "Pre-Seed",
  Seed = "Seed",
  SeriesA = "Series A",
  SeriesB = "Series B",
  SeriesC = "Series C",
  Later = "Later Stage"
}

// Zod schema for User
const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.enum(["creator", "business"]),
  audienceSize: z.number().optional(),
  contentTypes: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  fundingStage: z.nativeEnum(FundingStage).optional(),
  equityOfferRange: z.object({
    min: z.number().min(0).max(100),
    max: z.number().min(0).max(100)
  }).optional(),
  bio: z.string().optional(),
  isAdmin: z.boolean().default(false)
});

// Infer the TypeScript type from the Zod schema
type IUser = z.infer<typeof UserSchema> & Document;

// Mongoose schema (unchanged)
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["creator", "business"], required: true },
  audienceSize: { type: Number },
  contentTypes: [String],
  platforms: [String],
  companyName: { type: String },
  industry: { type: String },
  fundingStage: { type: String, enum: Object.values(FundingStage) },
  equityOfferRange: {
    min: { type: Number },
    max: { type: Number }
  },
  bio: { type: String },
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true,
  versionKey: false
});

const UserModel = mongoose.model<IUser>("User", userSchema);

// Function to validate user data using Zod
const validateUser = (data: unknown) => UserSchema.parse(data);

export { UserModel, IUser, FundingStage, UserSchema, validateUser };