import { User } from "../Models/userModel.js";
import { Order } from "../Models/orderModel.js";
import { Product } from "../Models/productModel.js";
import { TryCatch } from "../Utils/TryCatch.js";


/**
 * @function getAnalytics
 * @description
 * This function returns the analytics data for the dashboard
 * @returns {Promise<Object>} A promise that resolves to an object containing the analytics data
 * @property {Object} analyticsData - An object containing the analytics data
 * @property {Number} analyticsData.users - Total number of users
 * @property {Number} analyticsData.products - Total number of products
 * @property {Number} analyticsData.totalSales - Total sales
 * @property {Number} analyticsData.totalRevenue - Total revenue
 * @property {Object} salesDataOfWeek - An object containing the sales data for the week
 * @property {Date} salesDataOfWeek.startDate - The start date of the range
 * @property {Date} salesDataOfWeek.endDate - The end date of the range
 * @property {Object[]} salesDataOfWeek.salesData - An array of objects containing the sales data for each day
 * @property {String} salesDataOfWeek.salesData.date - The date in the format "YYYY-MM-DD"
 * @property {Number} salesDataOfWeek.salesData.sales - The total sales for the day
 * @property {Number} salesDataOfWeek.salesData.revenue - The total revenue for the day
 */

export const getAnalytics = TryCatch(async (req, res) => {

    const analyticsData = getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const salesDataOfWeek = getSalesDataOfWeek(startDate, endDate);

    return res.status(200).json({ analyticsData, salesDataOfWeek });
});
/**
 * @function getAnalyticsData
 * @description
 * This function returns the analytics data such as total users, products, total sales and total revenue
 * @returns {Object} An object containing the analytics data
 * @property {Number} users - Total number of users
 * @property {Number} products - Total number of products
 * @property {Number} totalSales - Total sales
 * @property {Number} totalRevenue - Total revenue
 */
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


/**
 * @function getAnalyticsData
 * Retrieves sales data for each day within the specified date range.
 * Aggregates total sales and revenue for each day from the orders.
 * If no sales data is found for a particular day, sales and revenue
 * will be returned as zero for that day.
 
 * @param {Date} startDate - The start date of the range (inclusive).
 * @param {Date} endDate - The end date of the range (inclusive).
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects,
 * each containing the date, sales, and revenue for each day in the specified range.
 */

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
/**
 * Returns an array of strings representing the dates in the given range (inclusive)
 * from the startDate to the endDate. The dates are in the ISO format (yyyy-mm-dd)
 * @param {Date} startDate - The start date of the range
 * @param {Date} endDate - The end date of the range
 * @returns {string[]} - An array of strings, each representing a date in the range
 */
function getDatesInThisRange(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}