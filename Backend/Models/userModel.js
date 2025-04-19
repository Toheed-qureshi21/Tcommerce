    import mongoose from "mongoose";

    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        cartItems: [
            {
                quantity: {
                    type: Number,
                    default: 1
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                }
            }
        ],
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

    }, {
        timestamps: true
    });

    export const User = mongoose.model("User", userSchema);