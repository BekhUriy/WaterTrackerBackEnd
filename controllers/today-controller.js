import WaterModel from "../schemas/waterSchema.js";

const getTodayStatistic = async (req, res, next) => {
  console.log('req.user', req.user)
  const { _id: owner, waterRate } = req.user;

  const { date } = req.body;
  
let startOfDay = new Date(date);
let endOfDay = new Date(date);

startOfDay.setHours(0, 0, 0, 0);
endOfDay.setHours(23, 59, 59, 999);

console.log('startDay', startOfDay) 
 console.log('endDay', endOfDay)

  const filter = {
    owner,
    date: { $gte: startOfDay, $lt: endOfDay },
  };

  try {
    const waterRecords = await WaterModel.find(filter, "date amountWater");

    // console.log('waterRecords', waterRecords)
    // Сума всіх записів споживання води за день
    const totalWaterConsumption = waterRecords.reduce(
      (acc, record) => acc + record.amountWater,
      0
    );
// console.log('waterRate', waterRate)
    //Відсоток кількості спожитої води за день
    const percentageOfWaterConsumption = Math.round(
      (totalWaterConsumption / waterRate) * 100,
      0
    );

    res.json({
      owner,
      percentageOfWaterConsumption,
      waterRecords,
    });
  } catch (error) {
    next(error);
  }
};

export default { getTodayStatistic };
