import { User } from "../Models/userModel.js";
import { Order } from "../Models/orderModel.js";
import { Product } from "../Models/productModel.js";
import { TryCatch } from "../Utils/TryCatch.js";


export const getAnalytics = TryCatch(async (req, res) => {

    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);
    const salesDataOfWeek = await getSalesDataOfWeek(startDate, endDate);

    return res.status(200).json({ analyticsData, salesDataOfWeek });
});

async function getAnalyticsData() {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);
        // Because it returns an array 
        const { totalSales, totalRevenue } = salesData[0];
        return {
            users: totalUsers,
            products: totalProducts,
            totalSales,
            totalRevenue
        }

    } catch (error) {
        throw error;
    }

}


async function getSalesDataOfWeek(startDate, endDate) {

    try {

        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                }
            },
            { $sort: { _id: 1 } },
        ]);

        const dateArray = getDatesInThisRange(startDate, endDate);

        return dateArray.map((date) => {
            const dataFound = dailySalesData.find((item) => item._id === date);

            return {
                date,
                sales: dataFound ? dataFound.sales : 0,
                revenue: dataFound ? dataFound.revenue : 0
            }
        });

    } catch (error) {
        throw error
    }
}

function getDatesInThisRange(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}