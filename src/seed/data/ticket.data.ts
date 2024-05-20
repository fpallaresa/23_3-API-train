import { user1, user2 } from './user.data';
import { journey1, journey2 } from './journey.data';
import { generateRandomAlphanumeric } from "../../utils/utils";

export const ticket1 = {
    locator: generateRandomAlphanumeric(10),
    isPaid: true,
    seatType: "VIP",
    journey: journey1,
    user: user1
};

export const ticket2 = {
    locator: generateRandomAlphanumeric(10),
    isPaid: false,
    seatType: "Business",
    journey: journey2,
    user: user2
};
