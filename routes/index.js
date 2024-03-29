import express from "express";
import authRouter from "./authRouter.js";


const router = express.Router();

router.use("/auth", authRouter); 
// включатиме роути з - Реєстрація користувача, Логін користувача, Авторизація, Вихід користувача з системи

router.use("/user", userRouter); 
//- Аватар користувача, Інформація про користувача, Оновлення інформації про користувача

router.use("/waterrate", waterRateRouter);
//WaterRate - - Розрахунок денної норми споживання води

router.use("/water", waterRouter); 
// - Додавання запису по спожитій воді; Редагування запису по спожитій воді; Видалення запису по спожитій воді

router.use("/today", todayRouter); 
//- Розрахунок в процентах кількості спожитої води і список всіх записів споживання води користувачем за поточний день

router.use("/month", monthRouter); 
//- Отримання інформації кількості спожитої води по обранному місяцю

export default router;