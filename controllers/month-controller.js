import { WaterModel } from "../schemas/waterSchema";

const getMonthStatictics = async (req, res, next) => {
  const { _id: owner, waterRate } = req.user;
  const { date } = req.query;

  const parsedDate = new Date(date);

  const day = parsedDate.getDate();
  const month = parsedDate.getMonth();
  const year = parsedDate.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const filter = {
    owner,
    date: { $gte: firstDayOfMonth, $lt: lastDayOfMonth },
  };
  try {
    const result = await WaterModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          totalAmountWater: { $sum: "$amountWater" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          day: "$_id",
          totalAmountWater: 1,
          count: 1,
          percentage: {
            $multiply: [{ $divide: ["$totalAmountWater", waterRate] }, 100],
          },
        },
      },
      { $sort: { day: 1 } },
    ]);

    function getMonthName(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
}
    const monthlyStatistics = result.map((record) => ({
      date: `${record.day}, ${getMonthName(month)}`,
      dailyNorm: waterRate,
      percentage: record.percentage.toFixed(2),
      totalRecords: record.count,
    }));

    res.json(monthlyStatistics);
  } catch (error) {
    next(error);
  }
};


export default {getMonthStatictics}
// const waterRecords = await WaterModel.find(filter, "date amountWater");

// // Розрахунок кількості споживань
// const totalWaterRecords = waterRecords.length;

// // Сума всіх записів споживання води за місяць
// const totalWaterConsumption = waterRecords.reduce((acc, record) => acc + record.amountWater, 0);

// // Відсоток спожитої води за день відносно норми
// const percentage = (totalWaterConsumption / waterRate ) * 100;

// // Форматування дати в формат "число, місяць"
// const formattedDate = `${parsedDate.getDate()}, ${getMonthName(parsedDate.getMonth())}`;

// res.json({
//     date: formattedDate,
//     waterRate,
//     percentage: percentage.toFixed(2),
//     entriesCount: totalWaterRecords;
// });
