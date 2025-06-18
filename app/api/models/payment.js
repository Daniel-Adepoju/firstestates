import {Schema,model,models} from "mongoose";

const PaymentSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Agent is required']
  },
  amount: Number,
  status: String,
  reference: String,
},{timestamps: true});

PaymentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 6 * 30 * 86400 });

const Payment = models?.Payment || model('Payment', PaymentSchema);
export default Payment