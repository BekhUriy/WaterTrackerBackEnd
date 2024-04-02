import WaterModel from "../schemas/waterSchema.js";

// export const getAllWater = async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// };
export const getWaterById = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const result = await WaterModel.findOne({ _id: id, owner });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const addWater = async (req, res, next) => {
  try {
    const { _id: owner, waterRate } = req.user;
    const result = await WaterModel.create({ ...req.body, owner, waterRate });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
export const updateWater = async (req, res, next) => {
  try {
    const { _id: owner} = req.user;
    const { id } = req.params;
    const result = await WaterModel.findOneAndUpdate(
      { _id: id, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteWater = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const result = await WaterModel.findOneAndDelete({ _id: id, owner });
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json({
      message: "Delete successfully",
    });
  } catch (error) {
    next(error);
  }
};
