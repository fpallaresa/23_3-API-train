import { train1, train2 } from './train.data';

export const journey1 = {
    departureTime: new Date("2023-05-01T08:00:00"),
    arrivalTime: new Date("2023-05-01T12:00:00"),
    originCity: "Madrid",
    destinationCity: "Barcelona",
    price: 50,
    train: train1
};

export const journey2 = {
    departureTime: new Date("2023-05-02T10:00:00"),
    arrivalTime: new Date("2023-05-02T14:00:00"),
    originCity: "Valencia",
    destinationCity: "Sevilla",
    price: 60,
    train: train2
};
