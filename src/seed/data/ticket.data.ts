import { user1, user2 } from './user.data';
import { journey1, journey2 } from './journey.data';

export const ticket1 = {
    locator: "ABC123",
    isPaid: true,
    seatType: "VIP",
    journey: journey1,
    user: user1
};

export const ticket2 = {
    locator: "XYZ456",
    isPaid: false,
    seatType: "Business",
    journey: journey2,
    user: user2
};
