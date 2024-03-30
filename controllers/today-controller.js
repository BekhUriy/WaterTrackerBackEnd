import { WaterModel } from "../schemas/waterSchema";

const getTodayStatistic = async (req, res, next) => {
  const { _id: owner, waterRate } = req.user;
  const date = new Date();

  const filter = {
    owner,
    date,
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
