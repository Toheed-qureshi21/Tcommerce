import mongoose from "mongoose";

const oauthAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    provider:{
        type:String,
        enum:["google","github"],
        default:[]
    },
    providerAccountId: {
        type: String,
        unique:true,
    },

});

export const OAuthAccount = mongoose.model("OAuthAccount", oauthAccountSchema);