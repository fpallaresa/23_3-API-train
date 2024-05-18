import { Treatment } from "../../models/User";

export const user1 = {
    firstName: "Juan",
    lastName: "Perez",
    email: "juanperez@email.com",
    password: "12345678",
    nationalityId: "12345678A",
    nationality: "España",
    birthDate: new Date("2002-03-01T00:00:00"),
    treatment: Treatment.SR
};

export const user2 = {
    firstName: "Ana",
    lastName: "Lopez",
    email: "analopez@email.com",
    password: "12345678",
    nationalityId: "91234567Z",
    nationality: "España",
    birthDate: new Date("2001-12-01T00:00:00"),
    treatment: Treatment.SRA
};
