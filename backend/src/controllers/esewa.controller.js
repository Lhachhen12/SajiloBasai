import crypto from "crypto";
import Booking from "../models/Booking.js";
import Payment from "../models/payment.js";
import {
  getEsewaPaymentHash,
  verifyEsewaPayment,
} from "../lib/email/esewa/esewa.js";
import Property from "../models/Property.js";

export const initializePayment = async (req, res, next) => {
  try {
    const { propertyId, contactInfo, bookingDetails, paymentMethod } = req.body;

    const property = await Property.findById(propertyId).populate("sellerId");

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }

    if (property.status !== "available") {
      res.status(400);
      throw new Error("Property is not available for booking");
    }

    // Prevent self-booking (seller cannot book their own property)
    if (property.sellerId._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot book your own property");
    }

    // Check for overlapping bookings
    const checkInDate = new Date(bookingDetails.checkInDate);
    const checkOutDate = bookingDetails.checkOutDate
      ? new Date(bookingDetails.checkOutDate)
      : new Date(
          checkInDate.getTime() +
            bookingDetails.duration * 30 * 24 * 60 * 60 * 1000
        );

    const overlappingBookings = await Booking.find({
      property: propertyId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          "bookingDetails.checkInDate": { $lt: checkOutDate },
          "bookingDetails.checkOutDate": { $gt: checkInDate },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      res.status(400);
      throw new Error("Property is already booked for the selected dates");
    }

    // Calculate payment amount (property price * duration)
    const paymentAmount = property.price * bookingDetails.duration;

    const order = await Booking.create({
      property: propertyId,
      buyer: req.user._id,
      seller: property.sellerId._id,
      contactInfo,
      bookingDetails: {
        ...bookingDetails,
        checkOutDate: checkOutDate,
      },
      payment: {
        method: paymentMethod,
        amount: paymentAmount,
      },
    });

    const orderId = order._id;

    const orderedData = await Booking.findByIdAndUpdate(orderId, { new: true });

    const paymentInitiate = await getEsewaPaymentHash({
      amount: orderedData.payment.amount,
      transaction_uuid: orderedData._id,
    });

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      paymentInitiate,
      payment_url: `${process.env.BACKEND_URI}/api/payments/generate-esewa-form?amount=${orderedData.payment.amount}&transaction_uuid=${orderId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const completePayment = async (req, res, next) => {
  const { data } = req.query;

  try {
    const paymentInfo = await verifyEsewaPayment(data);

    const createOrder = await Order.findById(
      paymentInfo.response.transaction_uuid
    );

    if (!createOrder) {
      return res.status(500).json({
        success: false,
        message: "Order not found",
      });
    }

    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      orderId: paymentInfo.decodedData.transaction_uuid,
      amount: paymentInfo.decodedData.total_amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      method: "esewa",
      paymentStatus: "Completed",
    });

    await Booking.findByIdAndUpdate(paymentInfo.response.transaction_uuid, {
      paymentStatus: "Completed",
      paymentMethod: "esewa",
    });

    await sendMail({
      to: `${createOrder.user_info.email}`,
      subject: "Payment Completed",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">Payment Completed</h1>
        <p>${createOrder.user_info.name},</p>
        <p>We are pleased to inform you that a payment has been successfully completed for the following order:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; border: 1px solid #ddd;">Detail</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Value</th>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Transaction ID</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${paymentData.transactionId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">PIDX</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${paymentData.pidx}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Order ID</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${paymentData.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Order Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${createOrder.user_info.email}</td>
          </tr>
           <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Amount</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${paymentData.amount}</td>
          </tr>
           <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Payment Method</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Esewa</td>
          </tr>
        </table>
        <p>Thank you for your prompt action.</p>
        <p style="color: #555;">Regards,</p>
        <p style="font-weight: bold;">Lucky Bootique</p>
      </div>
      `,
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/order/${paymentInfo.decodedData.transaction_uuid}`
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const fillEsewaForm = async (req, res, next) => {
  const amount = req.query.amount;
  const transaction_uuid = req.query.transaction_uuid;

  const paymentHash = await getEsewaPaymentHash({ amount, transaction_uuid });

  const nonce = crypto.randomBytes(16).toString("base64");

  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}'`
  );

  res.send(`
    <html>
      <body>
        <form id="esewaForm" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
          <input type="hidden" name="amount" value="${amount}" />
          <input type="hidden" name="tax_amount" value="0" />
          <input type="hidden" name="total_amount" value="${amount}" />
          <input type="hidden" name="transaction_uuid" value="${transaction_uuid}" />
          <input type="hidden" name="product_code" value="${process.env.ESEWA_PRODUCT_CODE}" />
          <input type="hidden" name="product_service_charge" value="0" />
          <input type="hidden" name="product_delivery_charge" value="0" />
          <input type="hidden" name="success_url" value="${process.env.BACKEND_URI}/api/payments/complete-payment" />
          <input type="hidden" name="failure_url" value="https://developer.esewa.com.np/failure" />
          <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
          <input type="hidden" name="signature" value="${paymentHash.signature}" />
        </form>
        <script type="text/javascript" nonce="${nonce}">
          document.getElementById("esewaForm").submit();
        </script>
      </body>
    </html>
  `);
};
