import WaterModel from "../schemas/waterSchema.js";

const getTodayStatistic = async (req, res, next) => {
  console.log('req.user', req.user)
  const { _id: owner, waterRate } = req.user;

  const date = new Date();
  console.log('date', date)
  const modifiedDate = new Date(date);
  
  modifiedDate.setUTCHours(0, 0, 0, 0);
  const startOfDay = modifiedDate.toISOString();
  // console.log('startDay', startOfDay)
  modifiedDate.setUTCHours(23, 59, 59, 999);
  const endOfDay = modifiedDate.toISOString();
//  console.log('endDay', endDay)

  const filter = {
    owner,
    date: { $gte: startOfDay, $lt: endOfDay },
  };

  try {
    const waterRecords = await WaterModel.find(filter, "date amountWater");

    // Сума всіх записів споживання води за день
    const totalWaterConsumption = waterRecords.reduce(
      (acc, record) => acc + record.amountWater,
      0
    );

    //Відсоток кількості спожитої води за день
    const percentageOfWaterConsumption = Math.round(
      (totalWaterConsumption / waterRate) * 100,
      0
    );

    res.json({
      owner: { id: owner },
      percentageOfWaterConsumption,
      waterRecords,
    });
  } catch (error) {
    next(error);
  }
};

export default { getTodayStatistic };
