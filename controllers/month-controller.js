import WaterModel from "../schemas/waterSchema.js";

const getMonthStatictics = async (req, res, next) => {
  const { _id: owner } = req.user;
  // console.log('req.query', req.query)

  const { date } = req.query;
  const parsedDate = new Date(date);
  const month = parsedDate.getUTCMonth();
  const year = parsedDate.getUTCFullYear();

  const firstDayOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

  const filter = {
    owner,
    date: { $gte: firstDayOfMonth, $lt: lastDayOfMonth },
  };

  try {
    const result = await WaterModel.aggregate([
      { $match: filter },
      { $sort: { date: -1 } }, // Сортуємо документи за спаданням дати (найпізніший документ буде першим)
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          totalAmountWater: { $sum: "$amountWater" },
          latestWaterRate: { $first: "$waterRate" }, // Вибираємо перше (останнє) значення waterRate за день
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          day: "$_id",
          latestWaterRate: 1,
          totalAmountWater: 1,
          count: 1,
          percentage: {
            $multiply: [
              { $divide: ["$totalAmountWater", "$latestWaterRate"] },
              100,
            ],
          },
        },
      },
      { $sort: { day: 1 } },
    ]);

    const getLastDayOfMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    console.log("result", result);
    // const monthlyStatistics = result.map((record) => ({
    //   date: `${record.day}, ${getMonthName(month)}`,
    //   dailyNorma: record.latestWaterRate,
    //   percentage: record.percentage.toFixed(2),
    //   totalRecords: record.count,
    // }));
    const monthlyStatistics = [];
    for (let day = 1; day <= getLastDayOfMonth(year, month); day++) {
      const record = result.find((item) => item.day === day);
      const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      const dailyStatistics = record
        ? {
            date: formattedDate,
            dailyNorma: record.latestWaterRate,
            percentage: record.percentage.toFixed(2),
            totalRecords: record.count,
          }
        : {
            date: formattedDate,
            dailyNorma: 0,
            percentage: 0,
            totalRecords: 0,
          };
      monthlyStatistics.push(dailyStatistics);
    }

    res.json(monthlyStatistics);
  } catch (error) {
    next(error);
  }
};

export default { getMonthStatictics };
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
